const { ApolloServer, gql } = require('apollo-server');

// Schema
const typeDefs = gql`
  
  type Course {
    title: String
  }

  type Technology {
    technology: String
  }

  type Query {
    getCourses: [Course]
    getTechnologys: [Technology]
  }
`;

const courses = [
  {
      title: 'JavaScript Moderno Guía Definitiva Construye +10 Proyectos',
      technology: 'JavaScript ES6',
  },
  {
      title: 'React – La Guía Completa: Hooks Context Redux MERN +15 Apps',
      technology: 'React',
  },
  {
      title: 'Node.js – Bootcamp Desarrollo Web inc. MVC y REST API’s',
      technology: 'Node.js'
  }, 
  {
      title: 'ReactJS Avanzado – FullStack React GraphQL y Apollo',
      technology: 'React'
  }
];

// Resolvers
const resolvers = {
  Query: {
    getCourses: () => courses,
    getTechnologys: () => courses
  }
}

// Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Run server
server.listen().then( ({ url }) => {
  console.log(`Server run on URL: ${url}`);
} );