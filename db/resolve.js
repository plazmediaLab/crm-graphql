const courses  = require('./db');

// Resolvers
const resolvers = {
  Query: {
    getCourses: (_, { input }, ctx) => {
      const result = courses.filter(course => course.technology === input.technology);
      return result;
    }
  }
}

module.exports = resolvers;