const { gql } = require('apollo-server');

// Schema
const typeDefs = gql`
  # Designamos la estructura y tipo de datos que contiene cada type User
  # Estos tipos de datos son los que retornara nuestra Mutación [newUser]
  # El id lo asignara MongoDB y el password no es asignado, ya que no queremos que lo devuelva GraphQL
  # Custom types   
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
  type Product {
    id: ID
    name: String
    exist: Int
    price: Float
    created: String
  }

  # Inputs
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
  input ProductInput {
    name: String!
    exist: Int!
    price: Float!
  }
  
  # Querys
  type Query{
    # Users
    getUser(token: String): User 
    # Products
    getProducts: [Product] 
    getProduct(id: ID!): Product 
  }

  # Mutations
  type Mutation {
    # Users
    newUser(input: UserInput): User
    authUser(input: AuthInput): Token
    
    # Products
    newProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deletProduct(id: ID!): String
  }
`;

module.exports = typeDefs;