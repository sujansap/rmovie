module.exports = {
    log: {
      level: 'info',
      disabled: false,
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
      genreMovies: 'TABLE_GENREMOVIES'
    },
    auth: {
      argon: {
        saltLength: 16,
        hashLength: 32,
        timeCost: 6,
        memoryCost: 2 ** 17,
      },
      jwt: {
        secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
        expirationInterval: 60 * 60 * 1000, // ms (1 hour)
        issuer: 'movieapp.be',
        audience: 'movieapp.be',
      },
    },
  };