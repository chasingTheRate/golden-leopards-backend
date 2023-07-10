const fs = require('fs');
const path = require('path');


const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.HEROKU_POSTGRESQL_MAUVE_URL,
    ssl: { rejectUnauthorized: false }
  }
});

var getGamesSQL = fs.readFileSync(path.join(__dirname, './sql/getGames.sql')).toString();
var getNextGamesSQL = fs.readFileSync(path.join(__dirname, './sql/getNextGames.sql')).toString();
var getGameResultsSQL = fs.readFileSync(path.join(__dirname, './sql/getGameResults.sql')).toString();
var getLeaguesSQL = fs.readFileSync(path.join(__dirname, './sql/getLeagues.sql')).toString();
var getPlayerGameStatsSQL = fs.readFileSync(path.join(__dirname, './sql/getPlayerGameStats.sql')).toString();
var getLeagueScheduleSQL = fs.readFileSync(path.join(__dirname, './sql/getLeagueSchedule.sql')).toString();
var getLeagueSQL = fs.readFileSync(path.join(__dirname, './sql/getLeague.sql')).toString();
var getCumlativePlayerGameStatsByLeagueSQL = fs.readFileSync(path.join(__dirname, './sql/getCumlativePlayerGameStatsByLeague.sql')).toString();
var getLeagueScheduleSQL = fs.readFileSync(path.join(__dirname, './sql/getLeagueSchedule.sql')).toString();
var getYearlyPlayerStatsByPlayerIdSQL = fs.readFileSync(path.join(__dirname, './sql/getYearlyPlayerStatsByPlayerId.sql')).toString();
var getAnnualPlayerStatsByPlayerIdSQL = fs.readFileSync(path.join(__dirname, './sql/getAnnualPlayerStatsByPlayerId.sql')).toString();
var getLeaguePlayerStatsByPlayerIdSQL = fs.readFileSync(path.join(__dirname, './sql/getLeaguePlayerStatsByPlayerId.sql')).toString();

const queryFromRaw = async (rawString, variable) => {
  const results = await knex.raw(rawString, variable).then();
  const { rows = [] } = results;
  return rows;
}

const getGames = async() => queryFromRaw(getGamesSQL)
const getNextGames = async () => queryFromRaw(getNextGamesSQL)
const getTournaments = async () =>  await knex('v_tournaments').where('hide', '=', false).orderBy('startdate', 'asc').then();
const getTournamentById = async (id) =>  await knex('v_tournaments').where('id', '=', id).first().then();
const getRoster = async () => await knex.select(
  'id',
  'displayname',
  'jerseynumber',
  's3_filename',
).from('players').where('active', '=', true).orderBy('displayname', 'asc').then();
const getLeagues = async () => queryFromRaw(getLeaguesSQL);
const getPlayerGameStats = async () => queryFromRaw(getPlayerGameStatsSQL);
const getLastGameResults = async () => queryFromRaw(getGameResultsSQL)
const getLogos = async () =>  await knex.select('id', 'display_name').from('logos').orderBy('display_name').then();
const getPlayersByIds = async (ids) => knex.select('displayname').from('players').whereIn('id', ids).then();
const getLeagueSchedule = async(leagueId) => queryFromRaw(getLeagueScheduleSQL, leagueId);
const getLeague = async(leagueId) => queryFromRaw(getLeagueSQL, leagueId);
const getCumlativePlayerGameStatsByLeague = async(leagueId) => queryFromRaw(getCumlativePlayerGameStatsByLeagueSQL, leagueId);
const getYearlyPlayerStatsByPlayerId = async(playerId) => queryFromRaw(getYearlyPlayerStatsByPlayerIdSQL, playerId);
const getAnnualPlayerStatsByPlayerId = async(playerId, year) => queryFromRaw(getAnnualPlayerStatsByPlayerIdSQL, [playerId, year]);
const getLeaguePlayerStatsByPlayerId = async(playerId, leagueId) => queryFromRaw(getLeaguePlayerStatsByPlayerIdSQL, [playerId, leagueId]);

const updateTournamentPlayers = async(id, tournament) => {

  const { player_ids = [] } = tournament;

  await knex.transaction(async trx => {
    
    await trx('tournaments_players')
      .where('tournamentid', '=', id)
      .del()

    if (player_ids.length > 0) {
      await trx('tournaments_players')
      .insert(player_ids.map(p => ({ tournamentid: id, playerid: p, active: true })))
    }
  })
}

const updateTournament = async(id, tournament) => (knex('tournaments')
  .where('id', '=', id)
  .update(tournament)
)

const createTournament = async (tournament) => {

  await knex.transaction(async trx => {
    
    const insertResults = await trx('tournaments')
      .insert(tournament)
      .returning('id');

    const tournamentId = insertResults[0].id;

    if (!tournamentId) {
      throw new Error('Database error: createTournament');
    }
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

const createLeague = async (league) => {

  return await knex.transaction(async trx => {
    const insertResults = await trx('leagues')
      .insert(league)
      .returning('id');

    const leagueId = insertResults[0].id;

    if (!leagueId) {
      throw new Error('Database error: createLeague');
    }

    return leagueId;
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
        saves: p.saves || 0,
        defensive_tackles: p.defensive_tackles || 0,
        captain: p.captain || false
      })))
  })
}

const updateLeague = async (id, league) => (knex('leagues')
  .where('id', '=', id)
  .update(league)
)

const getPlayersWithCurrentStats = async () => await knex('v_players_with_current_stats').orderBy('displayname', 'asc').then();

const getPlayerById = async (id) => await knex.select(
  'displayname', 
  'jerseynumber',
  'firstname',
  'lastname',
  'profile_image_filename',
).from('players').where('id', '=', id).then();

module.exports = {
  getTournaments,
  getTournamentById,
  getGames,
  getNextGames,
  getRoster,
  getLastGameResults,
  getLeagues,
  createTournament,
  updateTournamentPlayers,
  updateTournament,
  updateGame,
  createGame,
  getLogos,
  getPlayerGameStats,
  updatePlayerGameStats,
  getPlayersByIds,
  createLeague,
  updateLeague,
  getLeagueSchedule,
  getLeague,
  getCumlativePlayerGameStatsByLeague,
  getPlayersWithCurrentStats,
  getYearlyPlayerStatsByPlayerId,
  getAnnualPlayerStatsByPlayerId,
  getLeaguePlayerStatsByPlayerId,
  getPlayerById
}