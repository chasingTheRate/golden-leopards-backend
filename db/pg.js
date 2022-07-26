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



const queryFromRaw = async (rawString) => {
  const results = await knex.raw(rawString).then();
  const { rows = [] } = results;
  return rows;
}

const getGames = async() => queryFromRaw(getGamesSQL)
const getNextGames = async () => queryFromRaw(getNextGamesSQL)
const getTournaments = async () =>  await knex('v_tournaments').then();
const getRoster = async () => await knex.select('id', 'displayname').from('players').then();
const getLeagues = async () => queryFromRaw(getLeaguesSQL);
const getLastGameResults = async () => queryFromRaw(getGameResultsSQL)

const updateTournament = async(id, tournament) => {

  const { players = [] } = tournament;

  await knex.transaction(async trx => {
    
    await trx('tournaments_players')
      .where('tournamentid', '=', id)
      .del()

    await trx('tournaments_players')
      .insert(players.map(p => ({ tournamentid: id, playerid: p, active: true })))
  })
}

module.exports = {
  getTournaments,
  getGames,
  getNextGames,
  getRoster,
  getLastGameResults,
  getLeagues,
  updateTournament
}