
const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
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
  return knex.select().from('games').orderBy("startTime");
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

const getPlayersStats = async () => {
  return knex.raw(
    `SELECT
    stats."playerName",
    stats.total_goals + sup_stats.total_goals AS total_goals,
    stats.total_assists + sup_stats.total_assists AS total_assists,
    stats.total_saves + sup_stats.total_saves AS total_saves,
    stats.total_goals_allowed + sup_stats.total_goals_allowed AS total_goals_allowed,
    stats.avg_minutes_played_per_game,
    stats.total_complete_games
  FROM 
    player_stats stats
  JOIN
    public."playersSupplementaryStats" sup_stats
  ON
    sup_stats.playerid = stats.playerid
  ORDER BY
    total_goals DESC,
    total_assists DESC,
    total_saves DESC,
    total_goals_allowed ASC`
  )
}

const getTeamRecord = async () => {
  return knex.select().from('team_record');
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
  getPlayersStats,
  getTeamRecord
}