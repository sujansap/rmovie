module.exports = {
    log: {
      level: 'silly',
      disabled: true,
    },
    cors: { 
      origins: ['http://localhost:5173'], 
      maxAge: 3 * 60 * 60,
    },
    database_tables: {
      users: 'TABLE_USERS',
      reviews: 'TABLE_REVIEWS',
      movies: 'TABLE_MOVIES',
      usertypes: 'TABLE_USERTYPES',
      genres: 'TABLE_GENRES',
      genreMovies: 'TABLE_GENREMOVIES',
    },
  };
  