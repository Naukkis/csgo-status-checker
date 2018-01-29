function steamIDto64(steamid) {
  const serverId = steamid.slice(8, 9);
  const userId = steamid.slice(10);
  const base = '7656119';
  const basecalc = 7960265728;
  const steamid64temp = basecalc + (userId * 2) + parseInt(serverId, 10);
  const steamid64 = base + steamid64temp;
  return steamid64;
}

export default function findSteamID(input) {
  const steamIDregex = /STEAM_(0|1):(0|1):\d{1,}/g;
  const matches = [];
  let tempMatches;
  const steam64ID = {
    arr: [],
    query: '',
  };
  // eslint-disable-next-line
  while ((tempMatches = steamIDregex.exec(input)) !== null) {
    matches.push(tempMatches[0]);
  }
  if (matches.length > 0) {
    steam64ID.arr = matches.map(id => steamIDto64(id));
    steam64ID.arr.forEach((id) => { steam64ID.query += `${id},`; });
  } else {
    steam64ID.query = input.trim();
  }
  return steam64ID;
}
