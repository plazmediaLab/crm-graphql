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
  type Client {
    id: ID
    name: String
    lastname: String
    company: String
    email: String
    phone: String
    seller: ID
  }
  type Order {
    id: ID
    order: [OrderGroup]
    total: Float
    client: ID
    seller: ID
    created: String
    state: StateOrder
  }
  type OrderGroup {
    id: ID
    quantity: Int
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
  input ClientInput{
    name: String!
    lastname: String!
    company: String!
    email: String!
    phone: String
  }
  input OrderProductInput{
    id: ID
    quantity: Int
  }
  input OrderInput{
    order: [OrderProductInput]
    total: Float!
    client: ID!
    state: StateOrder
  }

  enum StateOrder{
    PENDING
    COMPLETED
    CANCELED
  }
  
  # Querys
  type Query{
    # Users
    getUser(token: String): User 
    # Products
    getProducts: [Product] 
    getProduct(id: ID!): Product 
    # Clients
    getClients: [Client]
    getSellerClients: [Client]
    getSellerClient(id: ID!): Client
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

    # Clients
    newClient(input: ClientInput): Client
    updateClient(id: ID!, input: ClientInput): Client
    deletClient(id: ID!): String 

    # Orders
    newOrder(input: OrderInput): Order 
  }
`;

module.exports = typeDefs;