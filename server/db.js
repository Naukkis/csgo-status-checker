const promise = require('bluebird');
const monitor = require('pg-monitor');

const options = {
  // Initialization Options
  promiseLib: promise,
};

//monitor.attach(options);
const pgp = require('pg-promise')(options);

const connectionString = process.env.DATABASE_URL;
const db = pgp(connectionString);

module.exports = db;
