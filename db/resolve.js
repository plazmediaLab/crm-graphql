const courses  = require('./db');

// Resolvers
const resolvers = {
  Query: {
    getCourse: () => 'Some thing...'
  },
  Mutation: {
    newUser: () => 'Creating new user...'
  }
}

module.exports = resolvers;