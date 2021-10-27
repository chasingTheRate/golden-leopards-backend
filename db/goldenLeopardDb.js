
const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DB_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
  },
});

const getSeasons = () => {
  return knex.select().from('seasons');
}

const createSeasons = (seasons) => {
  return knex('seasons').insert(seasons);
}

const deleteSeason = (seasonId) => {
  return knex('seasons')
    .where({ id: seasonId })
    .del()
}

const getGames = () => {
  return knex.select().from('games');
}

const createGames = (games) => {
  return knex('games').insert(games);
}

const deleteGame = (gameId) => {
  return knex('games')
    .where({ id: gameId })
    .del()
}

const getPlayers = () => {
  return knex.select().from('players');
}

const createPlayers = (players) => {
  return knex('players').insert(players);
}

const deletePlayer = (playerId) => {
  return knex('players')
    .where({ id: playerId })
    .del()
}

const getGameSegments = () => {
  return knex.select().from('gameSegments');
}

const createGameSegments = (gameSegments) => {
  return knex('gameSegments').insert(gameSegments);
}

const deleteGameSegment = (gameSegmentId) => {
  return knex('gameSegments')
    .where({ id: gameSegmentId })
    .del()
}

module.exports = {
  getSeasons,
  createSeasons,
  deleteSeason,
  getGames,
  createGames,
  deleteGame,
  getPlayers,
  createPlayers,
  deletePlayer,
  getGameSegments,
  createGameSegments,
  deleteGameSegment,
}