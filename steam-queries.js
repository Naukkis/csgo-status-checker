const axios = require('axios');
const apikey = process.env.STEAM_API_KEY;
const getPlayerBans = 'https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=' + apikey + '&steamids=';

function batchBanned(data) {
  let apibansquery = getPlayerBans;
  let queries = [];
  let friends = 0;
  data.data.friendslist.friends.forEach(function(id) {
        apibansquery +=  id.steamid + ",";
        friends++;
        if(friends > 99) {
          queries.push(apibansquery);
          apibansquery = getPlayerBans;
          friends = 0;
        }
    });
    queries.push(apibansquery);
  return queries;
}

function bannedFriends(req, res) {
  let url = 'https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=' + apikey + '&steamid=' + req.query.q;
  let axiosPromises = [];
  axios.get(url)
       .then((response) => {
          let queries = batchBanned(response);
          queries.forEach(function (query) {
            let banQuery = axios.get(query);
            axiosPromises.push(banQuery);
          })
          axios.all(axiosPromises)
               .then(axios.spread(function (...args) {
                  let results = [...args];
                  let complete = [];
                  results.forEach(function (banInfo) {
                    complete = [...complete, ...banInfo.data.players];
                  })
                  res.send(complete);
                }))
        })
       .catch((err) => {
          console.log(err);
        });
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
    .catch((error) => {
      console.log(error.message);
    })
}

function querySelector(req, res) {
  let url = '';
  switch(req.params.route) {
    case 'getFriends':
      url = 'https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=' + apikey + '&steamid=' + req.query.q;
      break;
    case 'getPlayerSummary':
      url = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=' + apikey + '&steamids=' + req.query.q;
      break;
    case 'getPlayerStats':
      url = 'http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=730&key=' + apikey + '&steamid=' + req.query.q;
      break;
    case 'recentlyPlayedGames':
      url ='http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=' + apikey + '&steamid=' + req.query.q;
      break;
    case 'banStatus':
      url = 'https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=' + apikey + '&steamids='  + req.query.q;
      break;
    default:
      res.send('Not found');
  }

  axios.get(url)
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}


module.exports = {
  bannedFriends,
  playTime,
  querySelector
}