const { gql } = require('apollo-server');

// Schema
const typeDefs = gql`
  # Designamos la estructura y tipo de datos que contiene cada type User
  # Estos tipos de datos son los que retornara nuestra Mutación [newUser]
  # El id lo asignara MongoDB y el password no es asignado, ya que no queremos que lo devuelva GraphQL
  type User {
    id: ID
    name: String
    lastname: String
    email: String
    created: String
  }
  type Token {
    token: String
  }

  input UserInput {
    name: String!
    lastname: String!
    email: String!
    password: String!
  }
  input AuthInput {
    email: String!
    password: String!
  }
  
  type Query{
    getUser(token: String): User 
  }

  type Mutation {
    newUser(input: UserInput): User
    authUser(input: AuthInput): Token
  }
`;

module.exports = typeDefs;