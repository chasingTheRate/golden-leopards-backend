const fs = require('fs');
const path = require('path');


const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  }
});

var getGamesSQL = fs.readFileSync(path.join(__dirname, './sql/getGames.sql')).toString();
var getNextGamesSQL = fs.readFileSync(path.join(__dirname, './sql/getNextGames.sql')).toString();
var getGameResultsSQL = fs.readFileSync(path.join(__dirname, './sql/getGameResults.sql')).toString();
var getLeaguesSQL = fs.readFileSync(path.join(__dirname, './sql/getLeagues.sql')).toString();
var getPlayerGameStatsSQL = fs.readFileSync(path.join(__dirname, './sql/getPlayerGameStats.sql')).toString();


const queryFromRaw = async (rawString) => {
  const results = await knex.raw(rawString).then();
  const { rows = [] } = results;
  return rows;
}

const getGames = async() => queryFromRaw(getGamesSQL)
const getNextGames = async () => queryFromRaw(getNextGamesSQL)
const getTournaments = async () =>  await knex('v_tournaments').where('hide', '=', false).orderBy('startdate', 'asc').then();
const getRoster = async () => await knex.select('id', 'displayname').from('players').where('active', '=', true).orderBy('displayname', 'asc').then();
const getLeagues = async () => queryFromRaw(getLeaguesSQL);
const getPlayerGameStats = async () => queryFromRaw(getPlayerGameStatsSQL);
const getLastGameResults = async () => queryFromRaw(getGameResultsSQL)
const getLogos = async () =>  await knex.select('id', 'display_name').from('logos').then();


const updateTournament = async(id, tournament) => {

  const { player_ids = [] } = tournament;

  await knex.transaction(async trx => {
    
    await trx('tournaments_players')
      .where('tournamentid', '=', id)
      .del()

    await trx('tournaments_players')
      .insert(player_ids.map(p => ({ tournamentid: id, playerid: p, active: true })))
  })
}

const updateGame = async (id, game) => (knex('games')
  .where('id', '=', id)
  .update(game)
)

const createGame = async ({ leagueid, game }) => {

  await knex.transaction(async trx => {
    
    const insertResults = await trx('games')
      .insert(game)
      .returning('id');

    const gameid = insertResults[0].id;

    if (!gameid) {
      throw new Error('Database error: updateGame');
    }

    await trx('leagues_games')
      .insert({ leagueid, gameid })
  })
}

const updatePlayerGameStats = async(id, playerGameStats) => {
  await knex.transaction(async trx => {
    
    await trx('player_game_stats')
      .where('game_id', '=', id)
      .del()

    await trx('player_game_stats')
      .insert(playerGameStats.map(p => ({
        player_id: p.id,
        game_id: id,
        goals: p.goals || 0,
        assists: p.assists || 0,
        defensive_tackles: p.defensive_tackles || 0
      })))
  })
}

module.exports = {
  getTournaments,
  getGames,
  getNextGames,
  getRoster,
  getLastGameResults,
  getLeagues,
  updateTournament,
  updateGame,
  createGame,
  getLogos,
  getPlayerGameStats,
  updatePlayerGameStats
}