const { db } = require('./db');
const crypto = require('crypto');
const { playerBanStatus } = require('./utilities');

function getUser(req, res, next) {
  const steamID = req.query.q;
  db.one('select * from users where steamid64 = $1', steamID)
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved ONE user',
      });
    })
    .catch(error => next(error));
}

function createUser(user, cb) {
  const userid = crypto.randomBytes(3 * 4).toString('base64');
  db.one('insert into users(user_id, steamid64, username) values($1, $2, $3) returning user_id', [userid, user.id, user.displayName])
    .then((data) => {
      const createdUser = user;
      createdUser.userid = data.user_id;
      cb(null, createdUser);
    })
    .catch(error => cb(error));
}

function findUser(user, cb) {
  db.oneOrNone('select user_id, steamid64 from users where steamid64 = $1', user.id)
    .then((data) => {
      if (data) {
        cb(null, data);
      } else {
        createUser(user, cb);
      }
    })
    .catch(err => cb(err));
}

function removeUser(req, res, next) {
  const steamID = req.query.q;
  db.result('delete from users where steamid64 = $1', steamID).then((result) => {
    res.status(200).json({
      status: 'success',
      message: result.rowCount,
    });
  })
    .catch(error => next(error));
}

function addMatch(req, res, next) {
  const {
    teammates,
    opponents,
    teamScore,
    opponentScore,
    map,
    userID,
  } = req.body;

  db.one(
    'insert into matches(team_score, opponent_score, map_played, user_id, added_at)'
    + ' values($1, $2, $3, $4, $5) returning match_id',
    [teamScore, opponentScore, map, userID, new Date()],
  )
    .then((data) => {
      teammates.forEach(id => addPlayer(id, data.match_id, 1));
      opponents.forEach(id => addPlayer(id, data.match_id, 2));
      res.status(200).json({
        status: 'success',
        message: 'match saved to user',
        matchID: data.match_id,
      });
    })
    .catch(error => next(error));
}

function addPlayerToMatch(steamid64, matchID, team) {
  db.none('insert into match_players(match_id, steamid64, team)'
        + ' values($1, $2, $3)', [matchID, steamid64, team])
    .catch(error => console.log(error));
}

function addPlayer(steamid64, match_id, team) {
  db.oneOrNone('insert into players(steamid64) values($1)', steamid64)
    .then(() => {
      addPlayerToMatch(steamid64, match_id, team);
    })
    .catch((error) => {
      if (error.code === '23505') {
        addPlayerToMatch(steamid64, match_id, team);
      } else {
        console.log(error.code, error.message);
      }
    });
}

function userSavedMatches(req, res, next) {
  const userID = req.session.user_id;
  db.any('select * from matches where user_id = $1 order by match_id desc', userID)
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data,
        message: 'Retrieved users saved matches',
      });
    })
    .catch(error => next(error));
}

function playersFromMatch(req, res, next) {
  const matchID = parseInt(req.query.q, 10);
  db.any('select steamid64, team, player_comment from match_players where match_id = $1', matchID)
    .then(async (data) => {

      const playerBans = await playerBanStatus(data);
      const team1 = data.filter(player => player.team === 1);
      const team2 = data.filter(player => player.team === 2);

      res.status(200).json({
        status: 'success',
        team1,
        team2,
        playerBans,
        message: 'Retrieved players from a match',
        time: new Date(),
      });
    })
    .catch(error => next(error));
}

function updateScore(req, res, next) {
  const { teamScore, opponentScore, matchID } = req.body;
  db.none('update matches set team_score = $1, opponent_score = $2 where match_id = $3', [teamScore, opponentScore, matchID])
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: 'updated score',
        time: new Date(),
      });
    })
    .catch(error => next(error));
}

function savePlayerComment(req, res, next) {
  const { comment, matchID, steamid64 } = req.body;
  db.none('update match_players set player_comment = $1 where match_id = $2 and steamid64 = $3', [comment, matchID, steamid64])
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: 'added comment',
        time: new Date(),
      });
    })
    .catch(error => next(error));
}

function previouslyPlayedWith(req, res, next) {
  const { steamid64 } = req.body;
  const playersToSearch = req.body.playersToSearch.split(',');
  db.any('select match_id from match_players where steamid64 = $1 intersect select match_id from match_players where steamid64 in ($2:csv)', [steamid64, playersToSearch])
    .then((data) => {
      res.status(200).json({
        status: 'success',
        message: 'Retrieved matches where played with same player',
        data,
        time: new Date(),
      });
    })
    .catch(error => next(error));
}

module.exports = {
  createUser,
  getUser,
  findUser,
  removeUser,
  addMatch,
  userSavedMatches,
  addPlayerToMatch,
  playersFromMatch,
  updateScore,
  savePlayerComment,
  previouslyPlayedWith,
};
