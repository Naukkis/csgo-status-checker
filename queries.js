var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:pelle@localhost:5432/statuschecker';
var db = pgp(connectionString);

function getAllUsers(req, res, next) {
  db.any('select * from users')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL users'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createUser(req, res, next) {
  console.log(req.body);
  db.none('insert into users(steamid64, username, email)'
        + 'values($1, $2, $3)',
        [req.body.steamid64, req.body.username, req.body.email])
    .then(() => {
      res.status(200)
     .json({
       status: 'success',
       message: 'Inserted user'
     });
    })
    .catch((error) => {
      return next(error);
    });
}

function getUser(req, res, next) {
    var steamID = req.query.q;
    db.one('select * from users where steamid64 = $1', steamID)
       .then(function (data) {
         res.status(200)
           .json({
             status: 'success',
             data: data,
             message: 'Retrieved ONE user'
           });
       })
       .catch(function (err) {
         return next(err);
       });
}

function removeUser(req, res, next) {
  var steamID = req.query.q;
  db.result('delete from users where steamid64 = $1', steamID)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: result.rowCount
        });
    })
    .catch(function (err) {
      return next(err)
    });
}

function addMatch(req, res, next) {
  let playerIDs = req.body.playerIDs.split(",");
  let endScore = req.body.endScore;
  db.none('insert into matches(players, end_score)'
          + 'values($1, $2)',[playerIDs, endScore])
          .then(() => {
              res.status(200)
             .json({
               status: 'success',
               message: 'Inserted match'
             });
          })
          .catch((error) => {
            return next(error);
          });
}

function saveMatch(req, res, next) {
  let userID = req.body.userID;
  let matchID = req.body.matchID;
  db.none('insert into saved_matches(user_id, match_id)'
        + 'values($1, $2)', [userID, matchID])
          .then(() => {
            res.status(200)
            .json({
              status: 'success',
              message: 'match saved to user'
            });
          })
          .catch((error) => {
            return next(error);
          });
}

function userSavedMatches(req, res, next) {
  let steamid64 = req.body.steamid64;
  db.any('select players, end_score from matches where id in (select match_id from saved_matches where user_id = (select id from users where steamid64 = $1))', steamid64)
        .then((data) => {
          res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved users saved matches'
            });
        })
        .catch((error) => {
          return next(error);
        });
}


module.exports = {
  getAllUsers: getAllUsers,
  createUser: createUser,
  getUser: getUser,
  removeUser: removeUser,
  addMatch: addMatch,
  saveMatch: saveMatch,
  userSavedMatches: userSavedMatches
};
