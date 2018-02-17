const express = require('express');
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
  extended: true,
}));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3001);

/*
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter as Router } from 'react-router-dom';
import App from './client/src/App';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'client', 'src', 'views'));

app.use(express.static(path.join(__dirname, 'client')));
*/
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new SteamStrategy({
  returnURL: 'http://localhost:3001/auth/steam/return',
  realm: 'http://localhost:3001/',
  apiKey: process.env.STEAM_API_KEY,
}, (identifier, profile, done) => {
  process.nextTick(() => {
    db.findUser(profile, (err, data) => {
      done(err, data);
    });
  });
}));

app.use(session({
  secret: 'some secret',
  name: 'statuschecker',
  resave: false,
  saveUninitialized: true,
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
  res.redirect('/');
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
  res.redirect('/logintest');
});

app.use('/database/add-match', ensureAuthenticated);

app.use('/auth', auth);
app.get('/database/get-user', db.getUser);
app.post('/database/create-user', db.createUser);
app.delete('/database/remove-user', db.removeUser);
app.post('/database/add-match', db.addMatch);
app.get('/database/matches', db.userSavedMatches);

app.get('/getBanned', steamQueries.bannedFriends);
app.get('/ownedGames', steamQueries.playTime);
app.get('/:route/', steamQueries.querySelector);

app.get('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Not found',
  });
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
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
