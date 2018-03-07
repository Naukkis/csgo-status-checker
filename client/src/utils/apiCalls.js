import axios from 'axios';

function playerSummaries(steamids, cb) {
  axios.get(`/steam/getPlayerSummary/?q=${steamids}`)
    .then((response) => {
      cb(response.data.response.players);
    })
    .catch(err => console.log(err));
}

function banStatus(steamids, cb) {
  axios.get(`/steam/banStatus/?q=${steamids}`)
    .then((response) => {
      cb(response.data.players);
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
  const combined = friendList.reduce((prev, curr) => {
    return prev.concat(curr);
  });
  const nickQuery = buildQuery(combined, idsToCompare);
  if (nickQuery) {
    axios.get(`/steam/getPlayerSummary/?q=${nickQuery}`)
      .then((response) => {
        response.data.response.players.forEach((player) => {
          friendNames.push(player.personaname);
        });
        cb(friendNames, countBannedFriends(combined));
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

function bannedOnFriendsList(steamid, cb) {
  axios.get(`/steam/getBanned/?q=${steamid}`)
    .then((response) => {
      cb(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function playerStats(steamid, cb) {
  axios.get(`/steam/getPlayerStats/?q=${steamid}`)
    .then((response) => {
      cb(response.data.playerstats.stats);
    })
    .catch((error) => {
      console.log(error);
    });
}

function CSGOPlayTime(steamid, cb) {
  axios.get(`/steam/ownedGames/?q=${steamid}`)
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
  bannedOnFriendsList,
  playerStats,
  CSGOPlayTime,
  checkWhoAreFriends,
};
