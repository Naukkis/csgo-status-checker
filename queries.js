const db = require('./db');
const crypto = require('crypto');

function getAllUsers(req, res, next) {
  db.any('select * from users').then((data) => {
    res.status(200).json({
      status: 'success',
      data,
      message: 'Retrieved ALL users',
    });
  }).catch(err => next(err));
}

function getUser(req, res, next) {
  const steamID = req.query.q;
  db.one('select * from users where steamid64 = $1', steamID).then((data) => {
    res.status(200).json({
      status: 'success',
      data,
      message: 'Retrieved ONE user',
    });
  }).catch(err => next(err));
}

function findUser(user, cb) {
  db.one('select * from users where steamid64 = $1', user.id).then((data) => {
    cb(null, data);
  }).catch((err) => {
    if (err.message === 'No data returned from the query.') {
      createUser(user, cb);
    } else {
      cb(err);
    }
  });
}

function createUser(user, cb) {
  const userid = crypto.randomBytes(3 * 4).toString('base64');
  db.none('insert into users(user_id, steamid64, username, email)' + 'values($1, $2, $3, $4)', [userid, user.id, user.displayName, 'tester']).then(() => {
    cb(null, user);
  }).catch(error => {
    cb(error);
  });
}

function removeUser(req, res, next) {
  var steamID = req.query.q;
  db.result('delete from users where steamid64 = $1', steamID).then(function (result) {
    res.status(200).json({
      status: 'success',
      message: result.rowCount
    });
  }).catch(function (err) {
    return next(err);
  });
}

function addMatch(req, res, next) {
  let playerIDs = req.body.playerIDs.split(",");
  let endScore = req.body.endScore;
  db.none('insert into matches(players, end_score)' + 'values($1, $2)', [playerIDs, endScore]).then(() => {
    res.status(200).json({
      status: 'success',
      message: 'Inserted match'
    });
  }).catch(error => {
    return next(error);
  });
}

function saveMatch(req, res, next) {
  let userID = req.body.userID;
  let matchID = req.body.matchID;
  db.none('insert into saved_matches(user_id, match_id)' + 'values($1, $2)', [userID, matchID]).then(() => {
    res.status(200).json({
      status: 'success',
      message: 'match saved to user'
    });
  }).catch(error => {
    return next(error);
  });
}

function userSavedMatches(req, res, next) {
  let steamid64 = req.body.steamid64;
  db.any('select players, end_score from matches where id in (select match_id from saved_matches where user_id = (select id from users where steamid64 = $1))', steamid64).then(data => {
    res.status(200).json({
      status: 'success',
      data: data,
      message: 'Retrieved users saved matches'
    });
  }).catch(error => {
    return next(error);
  });
}

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  findUser,
  removeUser,
  addMatch,
  saveMatch,
  userSavedMatches
};