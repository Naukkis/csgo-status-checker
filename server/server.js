if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const SteamStrategy = require('passport-steam').Strategy;
const auth = require('./routes/auth');
const steamAPI = require('./routes/steamAPI');
const dbQuery = require('./queries');
const { db } = require('./db');

const PGstore = require('connect-pg-simple')(session);

const app = express();

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3001);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const authUrl = process.env.NODE_ENV === 'production' ? 'http://csgo-checker.herokuapp.com' : 'http://localhost:3001';

passport.use(new SteamStrategy({
  returnURL: `${authUrl}/auth/steam/return`,
  realm: authUrl,
  apiKey: process.env.STEAM_API_KEY,
}, (identifier, profile, done) => {
  process.nextTick(() => {
    dbQuery.findUser(profile, (err, data) => {
      done(err, data);
    });
  });
}));

app.use(session({
  store: new PGstore({
    pgPromise: db,
  }),
  secret: process.env.SECRET,
  name: 'statuschecker',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
}));

app.use(passport.initialize());
app.use(passport.session());

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(morgan('dev'));

app.get('/loggedin', (req, res) => {
  req.session.user_id = req.user.user_id;
  req.session.steamid64 = req.user.steamid64;
  res.redirect('/');
  // res.status(200).send('<a href="http://localhost:3000/"> home</a>');
});

app.get('/user', (req, res) => {
  res.status(200).json({ user: req.session.user_id, steamid64: req.session.steamid64 });
});

function ensureAuthenticated(req, res, next) {
  req.body.userID = req.session.user_id;
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

app.get('/account', ensureAuthenticated, (req, res) => {
  res.status(200).json({ user: req.session.user_id });
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

app.use('/database/add-match', ensureAuthenticated);

app.use('/auth', auth);

app.get('/database/get-user', dbQuery.getUser);
app.post('/database/create-user', dbQuery.createUser);
app.delete('/database/remove-user', dbQuery.removeUser);
app.post('/database/add-match', dbQuery.addMatch);
app.get('/database/matches', dbQuery.userSavedMatches);
app.put('/database/matches/add-comment', dbQuery.savePlayerComment);
app.put('/database/matches/update-score', dbQuery.updateScore);
app.get('/database/players-from-match', dbQuery.playersFromMatch);
app.post('/database/previously-played-with', dbQuery.previouslyPlayedWith);

app.use('/auth', auth);
app.use('/steam', steamAPI);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'client', 'build', 'index.html'));
});

if (process.env.NODE_ENV === 'production') {
  app.use((err, req, res) => {
    res.status(err.code || 500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  });
} else {
  app.use((err, req, res) => {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  });
}

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
