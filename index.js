const { ApolloServer } = require('apollo-server');
const resolvers = require('./db/resolve');
const typeDefs = require('./db/schema');

const connectDB = require('./config/db');

require('dotenv').config({path: 'variables.env'});
const jwt = require('jsonwebtoken');

// Conectar a la Base de Datos
connectDB();

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {

    // console.log(req.headers.authorization); 
    // console.log(req.headers.plazmedia_process);

    // El context se pasa a todos los resolver a traves de los [Headers]
    // de la petición, en este caso nombrado ['authorization']
    const token = req.headers['authorization'] || '';
    if(token){
      try {
        
        const user = jwt.verify(token.replace('Bearer ', ''), process.env.KEY_WORD); 
        // console.log(user);
        
        return user;

      } catch (error) {
        console.log('There was a mistake');
        console.log(error);
      }
    }
  }
});

// Run server
server.listen({ port: process.env.PORT || 4000 }).then( ({ url }) => {
  console.log(`Server run on URL: ${url}`);
} );