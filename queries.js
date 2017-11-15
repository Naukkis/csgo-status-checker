var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:@localhost:5432/statuschecker';
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

module.exports = {
  getAllUsers: getAllUsers,
  createUser: createUser
};
