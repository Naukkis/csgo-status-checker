const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/steam',
  passport.authenticate('steam', { failureRedirect: '/failure' }),
  function(req, res) {
    res.redirect('/loggedin');
  });

router.get('/steam/return',
  function(req, res, next) {
      req.url = req.originalUrl;
      next();
  }, 
  passport.authenticate('steam', { failureRedirect: '/failure' }),
  function(req, res) {
    res.redirect('/loggedin');
  });

module.exports = router;
