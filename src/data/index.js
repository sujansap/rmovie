const { PrismaClient } = require('@prisma/client')
const config = require('config');
const prisma = new PrismaClient();

const TABLE_USERS = config.get('database_tables.users');
const TABLE_REVIEWS = config.get('database_tables.reviews');
const TABLE_MOVIES = config.get('database_tables.movies');

const tables = Object.freeze({
  users:TABLE_USERS,
  reviews:TABLE_REVIEWS,
  movies: TABLE_MOVIES
});

module.exports = {
  prisma,
  tables
}

