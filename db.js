const promise = require('bluebird');

const options = {
  // Initialization Options
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString = 'postgres://postgres:@localhost:5432/statuschecker';
const db = pgp(connectionString);

module.exports = db;