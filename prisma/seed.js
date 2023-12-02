const { PrismaClient } = require('@prisma/client');
//yarn prisma db seed
const config = require('config');
const TABLE_USERS = config.get('database_tables.users');
const TABLE_REVIEWS = config.get('database_tables.reviews');
const TABLE_MOVIES = config.get('database_tables.movies');
const TABLE_USERTYPES = config.get('database_tables.usertypes');
const TABLE_GENRES = config.get('database_tables.genres');
const TABLE_MOVIEGENRES = "genreMovies";

const Role = require("../src/core/roles");

const prisma = new PrismaClient();

async function main() {
  await prisma.reviews.deleteMany({});
  await prisma.genreMovies.deleteMany({});
  await prisma.movies.deleteMany({});
  await prisma.genres.deleteMany({});
  await prisma.users.deleteMany({});
  await prisma.userTypes.deleteMany({});

  console.log("seeding the db....");
  const userType1 = await prisma[TABLE_USERTYPES].create({
    data: {
      name: Role.USER,
    },
  });

  const userType2 = await prisma[TABLE_USERTYPES].create({
    data: {
      name: Role.ADMIN,
    },
  });

  // create an admin
  const user1 = await prisma[TABLE_USERS].create({
    data: {
      username: 'Jan admin',
      email: 'janadmin@gmail.com',
      password: '$argon2id$v=19$m=131072,t=6,p=4$7A7q0MvdTJ4pWSp/ZZjITw$EmMs3VBVuF5H9vMzsQiKWVYroKHG+j/WxjVmvjJIUmE',
      userTypeId: userType2.userTypeId,
    },
  });

  const user2 = await prisma[TABLE_USERS].create({
    data: {
      username: 'user2',
      email: 'user2@example.com',
      password: '$argon2id$v=19$m=131072,t=6,p=4$7A7q0MvdTJ4pWSp/ZZjITw$EmMs3VBVuF5H9vMzsQiKWVYroKHG+j/WxjVmvjJIUmE',
      userTypeId: userType2.userTypeId,
    },
  });

  // Create genres
  const genre1 = await prisma[TABLE_GENRES].create({
    data: {
      genre: 'action',
    },
  });

  const genre2 = await prisma[TABLE_GENRES].create({
    data: {
      genre: 'comedy',
    },
  });

  // Create movies
  const movie1 = await prisma[TABLE_MOVIES].create({
    data: {
      title: 'Avengers',
      synopsis:'When Thor\'s evil brother, Loki (Tom Hiddleston), gains access to the unlimited power of the energy cube called the Tesseract, Nick Fury (Samuel L. Jackson), director of S.H.I.E.L.D., initiates a superhero recruitment effort to defeat the unprecedented threat to Earth. Joining Fury\'s "dream team" are Iron Man (Robert Downey Jr.), Captain America (Chris Evans), the Hulk (Mark Ruffalo), Thor (Chris Hemsworth), the Black Widow (Scarlett Johansson) and Hawkeye (Jeremy Renner).',
      poster: 'https://www.movienewsletters.net/photos/067625R1.jpg',
      userId: user1.userId,
    },
  });

  const movie2 = await prisma[TABLE_MOVIES].create({
    data: {
      title: 'The Truman show',
      synopsis:'He doesn\'t know it, but everything in Truman Burbank\'s (Jim Carrey) life is part of a massive TV set. Executive producer Christof (Ed Harris) orchestrates "The Truman Show," a live broadcast of Truman\'s every move captured by hidden cameras. Cristof tries to control Truman\'s mind, even removing his true love, Sylvia (Natascha McElhone), from the show and replacing her with Meryl (Laura Linney). As Truman gradually discovers the truth, however, he must decide whether to act on it.',
      poster: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQJ6lpaPi5tx1WlFckXUTwPNioqCsLfTAqtgr2V5AGdLun7uCOW',
      userId: user2.userId,
    },
  });

  await prisma[TABLE_MOVIEGENRES].create({
    data: {
      genreId: genre1.genreId,
      movieId: movie1.movieId,
    },
  });

  await prisma[TABLE_MOVIEGENRES].create({
    data: {
      genreId: genre2.genreId,
      movieId: movie2.movieId,
    },
  });

  // Create reviews
  await prisma[TABLE_REVIEWS].create({
    data: {
      userId: user1.userId,
      movieId: movie1.movieId,
      rating: 5,
      review: 'Great movie!',
    },
  });

  await prisma[TABLE_REVIEWS].create({
    data: {
      userId: user2.userId,
      movieId: movie2.movieId,
      rating: 4,
      review: 'Funny movie!',
    },
  });
  
}


const seed = async () =>{
    try {
        await main();
    } catch (error) {
        throw error;
    }finally{
        await prisma.$disconnect();
    }
}


seed();
