import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    user(id: ID!): User
  }

  extend type Mutation {
    signUp(username: String!, steamid64: String!): Boolean!
  }

  type User {
    id: ID!
    username: String!
    steamid64: String!
  }
`;
