const express = require('express');
const request = require('request');
const axios = require('axios');
const db = require('./queries');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const steamQueries = require('./steam-queries');

const app = express();

app.set('port', process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(morgan('dev'));

app.get('/getBanned', steamQueries.bannedFriends);

app.get('/database/get-user', db.getUser);
app.get('/database/get-all-users', db.getAllUsers);
app.post('/database/create-user', db.createUser);
app.delete('/database/remove-user', db.removeUser);
app.post('/database/add-match', db.addMatch);
app.post('/database/save-match', db.saveMatch);
app.post('/database/saved-matches', db.userSavedMatches);

app.get('/ownedGames', steamQueries.playTime);

app.get('/:route/', steamQueries.querySelector);

if (process.env.NODE_ENV === 'production') {
  app.use(function(err, req, res, next) {
    res.status( err.code || 500 )
    .json({
      status: 'error',
      message: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  .json({
    status: 'error',
    message: err.message
  });
  console.log(err.message);
});


app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
