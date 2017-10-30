export function steamidTo64(steamid) {
    let serverId = steamid.slice(8,9);
    let userId = steamid.slice(10);
    let base = '7656119';
    let basecalc = 7960265728;
    let steamid64temp = basecalc + (userId * 2) + parseInt(serverId, 10);
    let steamid64 = base + steamid64temp;
    return steamid64;
}
