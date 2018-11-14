import db from './databaseSetup';

export const user = {
  UserModel: {
    getUser(steamID){
      console.log(steamID);
      return db.one('select username, steamid64 from users where steamid64 = $1', steamID);
    },
  }
};
