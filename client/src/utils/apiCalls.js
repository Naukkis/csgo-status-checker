import axios from 'axios';

function playerSummaries(steamids, cb) {
  axios.get(`getPlayerSummary/?q=${steamids}`)
    .then((response) => {
      cb(response.data.response.players);
    })
    .catch(err => console.log(err));
}

function banStatus(steamid, cb) {
  axios.get(`banStatus/?q=${steamid}`)
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

function checkWhoAreFriends(friendList, idsToCompare, cb) {
  const friends = [];
  let nickQuery = '';
  friendList.forEach((player) => {
    idsToCompare.forEach((id) => {
      if (id === player.SteamId) {
        nickQuery += `${player.SteamId},`;
      }
    });
  });
  axios.get(`getPlayerSummary/?q= ${nickQuery}`)
    .then((response) => {
      response.data.response.players.forEach((player) => {
        friends.push(player.personaname);
      });
      cb(friends, countBannedFriends(friendList));
    })
    .catch((error) => {
      console.log(error);
    });
}

function friendsList(steamid, idsToCompare, cb) {
  axios.get(`getBanned/?q=${steamid}`)
    .then((response) => {
      checkWhoAreFriends(response.data, idsToCompare, cb);
    })
    .catch((error) => {
      console.log(error);
    });
}

function playerStats(steamid, cb) {
  axios.get(`getPlayerStats/?q=${steamid}`)
    .then((response) => {
      cb(response.data.playerstats.stats);
    })
    .catch((error) => {
      console.log(error);
    });
}

function CSGOPlayTime(steamid, cb) {
  axios.get(`ownedGames/?q=${steamid}`)
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
