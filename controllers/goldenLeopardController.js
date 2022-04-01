const db = require('../db/goldenLeopardDb');
const airtableDb = require('../db/airtable');
const scripts = require('../scripts');
const moment = require('moment');
const _ = require('lodash');
const redis = require('../db/redis');

const { v4: uuidv4 } = require('uuid');

const getSeasons = async () => {
  const result = await db.getSeasons();
  return result ? result : [];
}

const createSeasons = async (seasons) => {
  const result = await db.createSeasons(seasons);
  return result ? result : [];
}

const deleteSeason = async (seasonId) => {
  return db.deleteSeason(seasonId);
}

const getGames = async () => {
  const result = await db.getGames();
  return result ? result : [];
}

const createGames = async (games) => {
  const result = await db.createGames(games);
  return result ? result : [];
}

const deleteGame = async (gameId) => {
  return db.deleteGame(gameId);
}

const getPlayers = async () => {
  const result = await db.getPlayers();
  return result ? result : [];
}

const createPlayers = async (players) => {
  const result = await db.createPlayers(players);
  return result ? result : [];
}

const deletePlayer = async (playerId) => {
  return db.deletePlayer(playerId);
}

const getGameSegments = async () => {
  const result = await db.getGameSegments();
  return result ? result : [];
}

const createGameSegments = async (gameSegments) => {
  const result = await db.createGameSegments(gameSegments);
  return result ? result : [];
}

const deleteGameSegment = async (gameSegmentId) => {
  return db.deleteGameSegment(gameSegmentId);
}

const getPlayersStats = async () => {
  const result = await db.getPlayersStats();
  const rows = result ? result.rows : [];
  return rows ? rows : [];
}

const getTeamRecord = async () => {
  const result = await db.getTeamRecord();
  return result[0] ? result[0] : [];
}

const getUpcomingGames = async () => {
  const date = new Date();
  const result = await db.getUpcomingGames(date.toISOString());
  return result ? result : [];
}

const getSeasonSchedule = async () => {

  let result = await redis.getValue('seasonSchedule');

  if (!result) {
    result = await airtableDb.getSeasonSchedule();
    await redis.setValue('seasonSchedule', result, 21600);
  } 

  return result ? result : [];

}

const getTournamentSchedules = async () => {

  let key = 'tournamentSchedules';
  let timeout = 21600; //seconds

  let result = await redis.getValue(key);

  if (!result) {
    result = await airtableDb.getTournamentSchedules();
    await redis.setValue(key, result, timeout);
  }
  
  return result ? result : [];
}

const updateTournament = async (id, tournament) => {

  let key = 'tournamentSchedules';
  const result = await airtableDb.updateTournament(id, tournament);

  // Clear Redis
  await redis.deleteKey(key);

  return result ? result : [];
}

const getRoster = async () => {
  const result = await airtableDb.getRoster();
  return result ? result : [];
}

const checkForUpdates = async () => {
  return scripts.getCalendars();
}

const getNextGames = async () => {
  let result = await airtableDb.getNextGames();
  result = result.map(r => {
    r.startDate = moment(r.start).format('YYYY-MM-DD');
    return r;
  })
  result = _.groupBy(result, 'startDate');
  result = Object.entries(result).map(([key, value]) => value);
  result = result[0];
  return result ? result : [];
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
  getTeamRecord,
  getUpcomingGames,
  getSeasonSchedule,
  getTournamentSchedules,
  updateTournament,
  getRoster,
  checkForUpdates,
  getNextGames,
}