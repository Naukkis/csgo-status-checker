const crypto = require("crypto");
import { user } from "../models/user";
import db from "../models/databaseSetup";
export default {
  Query: {
    user: async (parent, { id }, { db }) => {
      return await user.UserModel.getUser(id, db);
    }
  },

  Mutation: {
    signUp: async (parent, { username, steamid64 }) => {
      const userid = crypto.randomBytes(3 * 4).toString("base64");
      const userCreated = db.one(
        "insert into users(user_id, steamid64, username) values($1, $2, $3) returning user_id",
        [userid, steamid64, username]
      );
      return userCreated !== undefined;
    }
  }
};
