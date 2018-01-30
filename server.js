const express = require('express');
const request = require('request');
const axios = require('axios');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const auth = require('./auth');

const db = require('./queries');
const steamQueries = require('./steam-queries');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  db.findUser(user, function (err, data) {
    done(err, data);
  });
});

passport.use(new SteamStrategy({
  returnURL: 'http://localhost:3001/auth/steam/return',
  realm: 'http://localhost:3001/',
  apiKey: process.env.STEAM_API_KEY
}, function (identifier, profile, done) {
  process.nextTick(function () {
    profile.identifier = identifier;
    return done(null, profile);
  });
}));

app.use(session({
  secret: 'some secret',
  name: 'statuschecker',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

app.set('port', process.env.PORT || 3001);

app.use(passport.initialize());
app.use(passport.session());

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(morgan('dev'));

app.get('/logintest', function (req, res) {
  res.send({ user: req.user });
});

app.get('/account', ensureAuthenticated, function (req, res) {
  res.send({ user: req.user });
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/logintest');
});

app.use('/auth', auth);
app.get('/database/get-user', db.getUser);
app.get('/database/get-all-users', db.getAllUsers);
app.post('/database/create-user', db.createUser);
app.delete('/database/remove-user', db.removeUser);
app.post('/database/add-match', db.addMatch);
app.post('/database/save-match', db.saveMatch);
app.post('/database/saved-matches', db.userSavedMatches);

app.get('/getBanned', steamQueries.bannedFriends);
app.get('/ownedGames', steamQueries.playTime);
app.get('/:route/', steamQueries.querySelector);

if (process.env.NODE_ENV === 'production') {
  app.use(function (err, req, res, next) {
    res.status(err.code || 500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  });
}

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message
  });
  console.log(err.message);
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}