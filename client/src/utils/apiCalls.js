import axios from 'axios';

async function playerSummaries(steamids) {
  const summaries = await axios.get(`/steam/getPlayerSummary/?q=${steamids}`)
  return summaries.data.response.players;
}

async function banStatus(steamids) {
  const banStatuses = await axios.get(`/steam/banStatus/?q=${steamids}`);
  return banStatuses.data.players;
}

async function getPlayerBansOnFriendList(steamid) {
  let friendListBanStatuses = {};
  try {
    friendListBanStatuses = await axios.get(`/steam/getBanned/?q=${steamid}`);
  } catch (err) {
    return err;
  }
  return friendListBanStatuses.data;
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

function checkWhoAreFriends(friendList, playerIDsFromMatch, cb) {
  const friendNames = [];
  // people with >100 friends are returned in list of lists
  const friends = flattenFriendlist(friendList);
  const nickQuery = buildQuery(friends, playerIDsFromMatch);
  if (nickQuery) {
    axios.get(`/steam/getPlayerSummary/?q=${nickQuery}`)
      .then((response) => {
        response.data.response.players.forEach((player) => {
          friendNames.push(player.personaname);
        });
        cb(friendNames, countBannedFriends(friends));
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

function flattenFriendlist(friends) {
  let flatFriendList = [];
  if (friends.length > 1) {
    flatFriendList = friends.reduce((prev, curr) => {
      return prev.concat(curr);
    });
  } else {
    flatFriendList = friends;
  }
  return flatFriendList;
}

function buildQuery(friendList, playerIDsFromMatch) {
  let query = '';
  friendList.forEach((player) => {
    playerIDsFromMatch.forEach((id) => {
      if (id === player.SteamId) {
        query += `${player.SteamId},`;
      }
    });
  });
  return query;
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

module.exports = {
  playerSummaries,
  banStatus,
  getPlayerBansOnFriendList,
  playerStats,
  CSGOPlayTime,
  checkWhoAreFriends,
};
