import axios from 'axios';

async function playerSummaries(steamids) {
  const summaries = await axios.get(`/steam/getPlayerSummary/?q=${steamids}`);
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

module.exports = {
  playerSummaries,
  banStatus,
  getPlayerBansOnFriendList,
  playerStats,
  CSGOPlayTime,
};
