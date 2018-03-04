const axios = require('axios');

const apikey = process.env.STEAM_API_KEY;

function splitListToChunks(list) {
  const chunks = [];
  for (let i = 0; i < list.length; i += 100) {
    chunks.push(list.slice(i, i + 100));
  }
  return chunks;
}

function collectSteamIDs(friendslist) {
  return friendslist.map(friend => friend.steamid);
}

/*
  On Steam Web API (atleast on this particular query), maximum amount of IDs per query is 100,
  so users with more than 100 friends have to be splitted to multiple queries.
*/
function splitQueries(data) {
  const baseURL = `https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${apikey}&steamids=`;
  let apibansquery = baseURL;
  const queries = [];

  const listOfIDs = collectSteamIDs(data.friendslist.friends);
  splitListToChunks(listOfIDs).forEach((ids) => {
    apibansquery += ids.join(',');
    queries.push(apibansquery);
    apibansquery = baseURL;
  });
  return queries;
}

const waitForQueriesToFinish = (createdQueries) => {
  return Promise.all(createdQueries);
}

const createPlayerBanQueries = (friendsList) => {
  return splitQueries(friendsList.data).map(query => axios.get(query));
}

function bannedFriends(req, res) {
  const url = `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${apikey}&steamid=${req.query.q}`;
  axios.get(url)
    .then(createPlayerBanQueries)
    .then(waitForQueriesToFinish)
    .then(results => res.status(200).json([...results].map(x => x.data.players)))
    .catch(error => res.status(500).json({ error: 'something went wrong', message: error.message }));
}

function playTime(req, res) {
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1?key=${apikey}&format=json&input_json={"steamid":${req.query.q},"appids_filter":[730]}`;
  axios.get(url)
    .then((response) => {
      if (response.data.response.games) {
        res.send(response.data.response.games[0]);
      } else {
        res.send({ playtime_forever: 0 });
      }
    })
    .catch(error => res.status(500).json({ error: error.message }));
}

module.exports = {
  bannedFriends,
  playTime,
}