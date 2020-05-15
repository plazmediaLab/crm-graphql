const courses  = require('./db');

// Resolvers
const resolvers = {
  Query: {
    getCourse: () => 'Some thing...'
  },
  Mutation: {
    newUser: (_, { input }) => {
      console.log(input);
      
      return 'Creating new user...';
    }
  }
}

module.exports = resolvers;