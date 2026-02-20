import { gql } from 'graphql-tag';
// graphql/schema.js
const typeDefs = `#graphql
  type Movie {
    id: ID!
    name: String!
    director_name: String!
    production_house: String!
    release_date: String!
    rating: Float!
  }

  input MovieInput {
    name: String!
    director_name: String!
    production_house: String!
    release_date: String!
    rating: Float!
  }

  input MovieUpdateInput {
    name: String
    director_name: String
    production_house: String
    release_date: String
    rating: Float
  }

  type Query {
    getAllMovies: [Movie!]!
    getMovieById(id: ID!): Movie
    getMoviesByDirector(director_name: String!): [Movie!]!
  }

  type Mutation {
    addMovie(movie: MovieInput!): Movie!
    updateMovie(id: ID!, movie: MovieUpdateInput!): Movie!
    deleteMovie(id: ID!): Boolean!
  }
`;
module.exports = typeDefs;