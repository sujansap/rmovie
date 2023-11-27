const supertest = require('supertest'); 
const createServer = require('../src/createServer'); 
const { getPrimsa, tables } = require('../src/data/index'); 

const data = {
  userTypes: [
    {
      userTypeId: 1,
      name: 'user',
    },
    {
      userTypeId: 2,
      name: 'admin',
    },
  ],
  users: [
    {
      userId: 1,
      username: 'janmap',
      email: 'japmap@example.com',
      password: 'password123',
      about: 'This is a test user.',
      userTypeId: 1,
    },
    {
      userId: 2,
      username: 'jan2map',
      email: 'jap2map@example.com',
      password: 'password123',
      about: 'This is a test 2 user.',
      userTypeId: 1,
    },
  ],
  genres: [
    {
      genreId: 1,
      genre: 'action',
    },
    {
      genreId: 2,
      genre: 'drama',
    },
  ],
  movies: [
    {
      movieId: 1,
      title: 'Avengers',
      synopsis: 'This is a test movie.',
      poster: 'testmovie.jpg',
      userId: 1,
    },
    {
      movieId: 2,
      title: 'Avengers 2',
      synopsis: 'This is a second test movie.',
      poster: 'testmovie2.jpg',
      userId: 1,
    },
  ],
  reviews: [
    {
      userId: 1,
      movieId: 1,
      rating: 100,
      review: 'Great movie!',
    },
    {
      userId: 2,
      movieId: 1,
      rating: 100,
      review: 'this movie is amazing',
    },
  ],
  genreMovies: [
    {
      genreId: 1,
      movieId: 1,
    },
    {
      genreId: 1,
      movieId: 2,
    },
    {
      genreId: 2,
      movieId: 2,
    },
  ],
};


describe('Movies', () => {
    
    let server;
    let request;
    let prisma;
  
    
    beforeAll(async () => {
      server = await createServer(); 
      request = supertest(server.getApp().callback()); 
      prisma = getPrimsa(); 
    });
  
    
    afterAll(async () => {
      await server.stop();
    });
  
    const url = '/api/movies/'; // 👈 9

    describe('GET /api/movies', () => {

      // 👇 1
      beforeAll(async () => {

        const toDeleteMovies = [];
        //user does transaction at a place
        //user does review for a movie

        
        await prisma[tables.userTypes].createMany({data:data.userTypes});
        await prisma[tables.users].createMany({data:data.users});
        await prisma[tables.genres].createMany({data:data.genres});
        //await prisma[tables.movies].createMany({data:data.movies});
        //await prisma[tables.reviews].createMany({data:data.reviews});
        //await prisma[tables.movieGenres].createMany({data:data.genreMovies});
      });
  
      // 👇 3
      afterAll(async () => {
        await prisma.tables.movies.delete({
          where:{
            movieId:{
              in:{
                toDeleteMovies
              }
            }
          }
        });
  

      });
  
      it('should 200 and return all transactions', async () => {
        const response = await request.get(url);
        expect(response.status).toBe(200);
        console.log("the amout of items :" + response.body.items.length);
        expect(response.body.items.length).toBe(2); 

        expect(response.body.items).toEqual(
          [
            {
              movieId: 1,
              title: 'Avengers',
              synopsis: 'This is a test movie.',
              poster: 'testmovie.jpg',
              userId: 1
            },
            {
              movieId: 2,
              title: 'Avengers 2',
              synopsis: 'This is a second test movie.',
              poster: 'testmovie2.jpg',
              userId: 1,
            },
          ]
   
        );
   
     
      


      });
    });




    describe('POST /api/movies', () => {

      // 👇 1
      beforeAll(async () => {
        await prisma[tables.userTypes].createMany({data:data.userTypes});
        await prisma[tables.users].createMany({data:data.users});
        await prisma[tables.genres].createMany({data:data.genres});
        await prisma[tables.movies].createMany({data:data.movies});
        await prisma[tables.reviews].createMany({data:data.reviews});
        await prisma[tables.movieGenres].createMany({data:data.genreMovies});
      });
  
      // 👇 3
      afterAll(async () => {
     
      });
  
      it('should 200 and return all transactions', async () => {
        const response = await request.get(url);
        expect(response.status).toBe(200);
        console.log("the amout of items :" + response.body.items.length);
        expect(response.body.items.length).toBe(2); 

        expect(response.body.items).toEqual(
          [
            {
              movieId: 1,
              title: 'Avengers',
              synopsis: 'This is a test movie.',
              poster: 'testmovie.jpg',
              userId: 1
            },
            {
              movieId: 2,
              title: 'Avengers 2',
              synopsis: 'This is a second test movie.',
              poster: 'testmovie2.jpg',
              userId: 1,
            },
          ]
   
        );
   
     
      


      });
    });
  });