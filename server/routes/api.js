const express = require('express');
const dbQuery = require('../queries');

const router = express.Router();

function ensureAuthenticated(req, res, next) {
  req.body.userID = req.session.user_id;
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

router.use(ensureAuthenticated);

router.get('/get-user', dbQuery.getUser);
router.delete('/remove-user', dbQuery.removeUser);
router.post('/add-match', dbQuery.addMatch);
router.get('/matches', dbQuery.userSavedMatches);
router.get('/matches/info', dbQuery.matchInfo)
router.put('/matches/add-comment', dbQuery.savePlayerComment);
router.put('/matches/update-score', dbQuery.updateScore);
router.get('/players-from-match', dbQuery.playersFromMatch);
router.post('/previously-played-with', dbQuery.previouslyPlayedWith);

module.exports = router;
