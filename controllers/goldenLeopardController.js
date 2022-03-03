const db = require('../db/goldenLeopardDb');
const airtableDb = require('../db/airtable');
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
  const result = await airtableDb.getSeasonSchedule();
  return result ? result : [];
}

const getTournamentSchedules = async () => {
  const result = await airtableDb.getTournamentSchedules();
  return result ? result : [];
}

const updateTournament = async (id, tournament) => {
  const result = await airtableDb.updateTournament(id, tournament);
  return result ? result : [];
}

const getRoster = async () => {
  const result = await airtableDb.getRoster();
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
  getRoster
}