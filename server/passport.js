const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const authUrl = process.env.NODE_ENV === 'production' ? 'http://csgo-checker.herokuapp.com' : 'http://localhost:3001';

passport.use(new SteamStrategy({
  returnURL: `${authUrl}/auth/steam/return`,
  realm: authUrl,
  apiKey: process.env.STEAM_API_KEY,
}, (identifier, profile, done) => {
  process.nextTick(() => {
    dbQuery.findUser(profile, (err, data) => {
      done(err, data);
    });
  });
}));

export default passport;