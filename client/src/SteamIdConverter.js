export default function steamidTo64(steamid) {
  const serverId = steamid.slice(8, 9);
  const userId = steamid.slice(10);
  const base = '7656119';
  const basecalc = 7960265728;
  const steamid64temp = basecalc + (userId * 2) + parseInt(serverId, 10);
  const steamid64 = base + steamid64temp;
  return steamid64;
}
