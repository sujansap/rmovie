const { getLogger } = require("../core/logging");
const { prisma, tables } = require("../data/index");

const dbData = require("./index");
const TABLE = tables.genres;

const getAll = async () => {
  const filter = {};
  return await dbData.getAllData(TABLE, filter);
};

const getGenreId = async (g) => {
  const filter = {
    where: {
      genre: g,
    },
  };
  const genre = await dbData.getDataById(TABLE, filter);

  return genre.genreId;
};

const addGenres = async (mid, genres) => {
  //when you add a movie, you have to give genres, but genres are added to different table
  //for that reason we need to know the id of the movie row we just added into the db
  console.log("the big test ... genreId, movieId" + " movieid: " + mid);
  try {
    for (const genre of genres) {
      const gid = await getGenreId(genre);
      console.log(`this genre: ${genre} has id: ${gid}`);
      await prisma[tables.movieGenres].create({
        data: {
          genreId: gid,
          movieId: mid,
        },
      });
    }
  } catch (error) {
    getLogger().error("Error", {
      error,
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  getAll,
  addGenres,
};
