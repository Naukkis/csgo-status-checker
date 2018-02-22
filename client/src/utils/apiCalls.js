import axios from 'axios';

function playerSummaries(steamids, cb) {
  axios.get(`steam/getPlayerSummary/?q=${steamids}`)
    .then((response) => {
      cb(response.data.response.players);
    })
    .catch(err => console.log(err));
}

function banStatus(steamid, cb) {
  axios.get(`steam/banStatus/?q=${steamid}`)
    .then((response) => {
      cb(response.data.players[0]);
    })
    .catch((error) => {
      console.log(error);
    });
}

function countBannedFriends(friendList) {
  let bannedFriends = 0;
  friendList.forEach((player) => {
    if (player.VACBanned || player.CommunityBanned || player.NumberOfGameBans > 0) {
      bannedFriends += 1;
    }
  });
  return bannedFriends;
}

function buildQuery(friendList, idsToCompare) {
  let query = '';
  friendList.forEach((player) => {
    idsToCompare.forEach((id) => {
      if (id === player.SteamId) {
        query += `${player.SteamId},`;
      }
    });
  });
  return query;
}

function checkWhoAreFriends(friendList, idsToCompare, cb) {
  const friendNames = [];
  const nickQuery = buildQuery(friendList, idsToCompare);
  axios.get(`steam/getPlayerSummary/?q= ${nickQuery}`)
    .then((response) => {
      response.data.response.players.forEach((player) => {
        friendNames.push(player.personaname);
      });
      cb(friendNames, countBannedFriends(friendList));
    })
    .catch((error) => {
      console.log(error);
    });
}

function friendsList(steamid, cb) {
  axios.get(`steam/getBanned/?q=${steamid}`)
    .then((response) => {
      cb(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function playerStats(steamid, cb) {
  axios.get(`steam/getPlayerStats/?q=${steamid}`)
    .then((response) => {
      cb(response.data.playerstats.stats);
    })
    .catch((error) => {
      console.log(error);
    });
}

function CSGOPlayTime(steamid, cb) {
  axios.get(`steam/ownedGames/?q=${steamid}`)
    .then((response) => {
      cb(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
  playerSummaries,
  banStatus,
  friendsList,
  playerStats,
  CSGOPlayTime,
  checkWhoAreFriends,
};
