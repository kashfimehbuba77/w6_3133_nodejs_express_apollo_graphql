import MovieModel from '../models/Movie.js';

// Resolvers define the technique for fetching the types defined in the schema.

// graphql/resolvers.js
const MovieModel = require("../models/Movie.js");

const resolvers = {
  Query: {
    // a) Get all movies
    getAllMovies: () => MovieModel.getAll(),

    // b) Get movie by ID
    getMovieById: (_, { id }) => MovieModel.getById(id),

    // c) Get movies by Director name using static methods
    getMoviesByDirector: (_, { director_name }) =>
      MovieModel.getByDirectorName(director_name),
  },

  Mutation: {
    // a) Insert new movie
    addMovie: (_, { movie }) => MovieModel.add(movie),

    // b) Update movie
    updateMovie: (_, { id, movie }) => MovieModel.update(id, movie),

    // c) Delete movie by ID
    deleteMovie: (_, { id }) => MovieModel.deleteById(id),
  },
};

module.exports = resolvers;