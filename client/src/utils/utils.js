function hasBeenBanned(player) {
  let hasBannedPlayers = false;
  if (player.VACBanned) {
    hasBannedPlayers = true;
  }
  if (player.NumberOfGameBans > 0) {
    hasBannedPlayers = true;
  }
  return hasBannedPlayers;
}

function checkWhoAreFriends(friendList, playerSummariesFromMatch) {
  const friendNames = [];
  friendList.forEach((player) => {
    playerSummariesFromMatch.forEach((playerSum) => {
      if (playerSum.steamid === player.SteamId) {
        friendNames.push(playerSum.personaname);
      }
    });
  });
  return friendNames;
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
  checkWhoAreFriends,
  countBannedFriends,
  hasBeenBanned,
}
