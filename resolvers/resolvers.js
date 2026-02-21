import Movie from "../models/Movie.js";

const resolvers = {
  Query: {
    // a) Get all movies
    getAllMovies: async () => {
      return await Movie.find();
    },

    // b) Get movie by ID
    getMovieById: async (_, { id }) => {
      return await Movie.findById(id);
    },

    // c) Get movies by Director name using static methods
    getMoviesByDirector: async (_, { director_name }) => {
      return await Movie.findByDirector(director_name);
    },
  },

  Mutation: {
    // a) Insert new movie
    addMovie: async (_, { movie }) => {
      return await Movie.create(movie);
    },

    // b) Update movie
    updateMovie: async (_, { id, movie }) => {
      const updated = await Movie.findByIdAndUpdate(id, movie, {
        new: true,
        runValidators: true,
      });
      if (!updated) throw new Error("Movie not found");
      return updated;
    },

    // c) Delete movie by ID
    deleteMovie: async (_, { id }) => {
      const deleted = await Movie.findByIdAndDelete(id);
      return !!deleted;
    },
  },
};

export default resolvers;