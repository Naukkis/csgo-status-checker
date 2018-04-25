const express = require('express');
const axios = require('axios');
const steamQueries = require('../steam-queries');

const apikey = process.env.STEAM_API_KEY;
const router = express.Router();

function querySelector(req, res) {
  let url = '';
  switch (req.params.route) {
    case 'getFriends':
      url = `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${apikey}&steamid=${req.query.q}`;
      break;
    case 'getPlayerSummary':
      url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apikey}&steamids=${req.query.q}`;
      break;
    case 'getPlayerStats':
      url = `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=${apikey}&steamid=${req.query.q}`;
      break;
    case 'recentlyPlayedGames':
      url = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apikey}&steamid=${req.query.q}`;
      break;
    case 'banStatus':
      url = `https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${apikey}&steamids=${req.query.q}`;
      break;
    default:
      url = null;
  }

  if (!url) {
    res.status(404).send('Not found');
  } else {
    axios.get(url)
      .then(response => res.status(200).send(response.data))
      .catch(error => res.status(500).send(error.message));
  }
}

router.get('/getBanned', steamQueries.bannedFriends);
router.get('/ownedGames', steamQueries.playTime);
router.get('/:route', querySelector);

module.exports = router;