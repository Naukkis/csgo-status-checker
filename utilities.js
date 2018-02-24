const axios = require('axios');

const apikey = process.env.STEAM_API_KEY;

function hasBeenBanned(players) {
  let hasBannedPlayers = false;
  players.forEach((player) => {
    if (player.VACBanned) {
      hasBannedPlayers = true;
    }
    if (player.NumberOfGameBans > 0) {
      hasBannedPlayers = true;
    }
  });
  return hasBannedPlayers;
}

async function playerBanStatus(match) {
  const steamids = match.map(player => player.steamid64);
  const result = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${apikey}&steamids=${steamids}`);
  return result.data.players;
}

module.exports = {
  playerBanStatus,
};
