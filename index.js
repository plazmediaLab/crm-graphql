const { ApolloServer } = require('apollo-server');
const resolvers = require('./db/resolve');
const typeDefs = require('./db/schema');

const connectDB = require('./config/db');

// Conectar a la Base de Datos
connectDB();

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Run server
server.listen().then( ({ url }) => {
  console.log(`Server run on URL: ${url}`);
} );