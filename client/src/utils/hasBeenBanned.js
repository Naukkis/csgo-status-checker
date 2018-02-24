export default function hasBeenBanned(player) {
  let hasBannedPlayers = false;
  if (player.VACBanned) {
    hasBannedPlayers = true;
  }
  if (player.NumberOfGameBans > 0) {
    hasBannedPlayers = true;
  }
  return hasBannedPlayers;
};
