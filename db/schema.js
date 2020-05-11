const { gql } = require('apollo-server');

// Schema
const typeDefs = gql`
  
  type Course {
    title: String
  }
  type Technology {
    technology: String
  }

  input CourseInput {
    technology: String
  }

  type Query {
    getCourses(input: CourseInput!): [Course]
    getTechnologys: [Technology]
  }

`;

module.exports = typeDefs;