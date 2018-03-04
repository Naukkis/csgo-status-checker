const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/steam', passport.authenticate('steam', { failureRedirect: '/failure' }), (req, res) => {
  res.redirect('/loggedin');
});

router.get('/steam/return', (req, res, next) => {
  req.url = req.originalUrl;
  next();
}, passport.authenticate('steam', { failureRedirect: '/failure' }), (req, res) => {
  res.redirect('/loggedin');
});

module.exports = router;
