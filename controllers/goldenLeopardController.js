const airtableDb = require('../db/airtable');
const db = require('../db/pg');

const scripts = require('../scripts');
const moment = require('moment');
const _ = require('lodash');
const redis = require('../db/redis');

const cKeys = require('../util/cacheKeys');
const notifications = require('../util/notifications');

const getSeasonSchedule = async () => {

  let key = cKeys.seasonSchedule;
  let timeout = 21600; //seconds

  let result = await redis.getValue(key);

  if (!result) {
    const [
      games, 
      leagues,
      playerGameStats,
    ] = await Promise.all([
      db.getGames(),
      db.getLeagues(),
      db.getPlayerGameStats()
    ]);

    const groupedPlayerGameStatsByGameId = _.chain(playerGameStats)
      .groupBy('game_id')
      .value();

    result = _.chain(games)
      .groupBy('league_id')
      .map((value, key) => {
        return { 
          league: leagues.find(l => l.id === key), 
          games: value.map(game => {
            game.playerStats = groupedPlayerGameStatsByGameId[game.id] || [];
            return game;
          })
        }
      })
      .value();

    await redis.setValue(key, result, timeout);
  } 

  return result ? result : [];

}

const updateGame = async (id, game) => {

  delete game.logoheight;
  delete game.logowidth;
  delete game.logofilename;
  delete game.leagueid;
  delete game.playerStats;

  notifications.send(`Game Updated! \n\n ${JSON.stringify(game, 0, 1)}`);

  // Clear Redis
  let key = cKeys.seasonSchedule;
  await redis.deleteKey(key);

  await db.updateGame(id, game);
}

const createGame = async (game) => {

  const tempGame = Object.assign({}, game);

  delete tempGame.logoheight;
  delete tempGame.logowidth;
  delete tempGame.logofilename;
  delete tempGame.leagueid;

  notifications.send(`Game Created! \n\n ${JSON.stringify(game, 0, 1)}`);

  // Clear Redis
  let key = cKeys.seasonSchedule;
  await redis.deleteKey(key);

  await db.createGame({ leagueid: game.leagueid, game: tempGame });
}



const getTournamentSchedules = async () => {

  let key = cKeys.tournamentSchedules;
  let timeout = 21600; //seconds
  
  try {

    let result = await redis.getValue(key);

    if (!result) {
      result = await db.getTournaments();
      result = result.map(t => {
        if (t.players) {
          t.players = t.players.split(', ');
        }
        if (t.player_ids) {
          t.player_ids = t.player_ids.split(', ');
        }
        return t;
      })
      await redis.setValue(key, result, timeout);
    }

    return result ? result : [];

  } catch (e) {
    console.error(e);
    return [];
  }
}

const updateTournament = async (id, tournament) => {

  // Clear Redis
  let key = cKeys.tournamentSchedules;
  await redis.deleteKey(key);

  await db.updateTournament(id, tournament);
}


const getRoster = async () => {

  let key = cKeys.roster;
  let timeout = 21600; //seconds

  let result = await redis.getValue(key);

  if (!result) {
    result = await db.getRoster();
    await redis.setValue(key, result, timeout);
  }

  return result ? result : [];

}

const checkForUpdates = async () => {
  return scripts.getCalendars();
}

const getNextGames = async () => {
  let key = cKeys.nextGames;
  let timeout = 21600; //seconds

  let result = await redis.getValue(key);

  if (!result) {
    result = await db.getNextGames();
    result = result.map(r => {
      r.startDate = moment(r.start).format('YYYY-MM-DD');
      return r;
    })
    result = _.groupBy(result, 'startDate');
    result = Object.entries(result).map(([key, value]) => value);
    result = result[0] ? result[0] : [];
    await redis.setValue(key, result, timeout);
  }
  
  return result ? result : [];
}

const clearTournamentScheduleCache = async () => await clearAllCache();

const clearAllCache = async () => {
  await redis.deleteKey(cKeys.seasonSchedule);
  await redis.deleteKey(cKeys.lastGameResults);
  await redis.deleteKey(cKeys.nextGames);
  await redis.deleteKey(cKeys.leagues);
  await redis.deleteKey(cKeys.tournamentSchedules);
  await redis.deleteKey(cKeys.roster);
  await redis.deleteKey(cKeys.logos);
}


const getLastGameResults = async () => {
  
  let key = cKeys.lastGameResults;
  let timeout = 21600; //seconds

  let result = await redis.getValue(key);

  if (!result) {
    result = await db.getLastGameResults();
    await redis.setValue(key, result, timeout);
  }

  result = result.map(r => {
    r.startDate = moment(r.start).format('YYYY-MM-DD');
    return r;
  })
  result = _.groupBy(result, 'startDate');
  result = Object.entries(result).map(([key, value]) => value);
  result = result[0];

  return result ? result : [];
}

const getLeagues = async () => {
  
  let key = cKeys.leagues;
  let timeout = 21600; //seconds

  let result = await redis.getValue(key);

  if (!result) {
    result = await db.getLeagues();
    await redis.setValue(key, result, timeout);
  }
  return result ? result : [];
}

const getLogos = async () => {
  
  let key = cKeys.logos;
  let timeout = 21600; //seconds

  let result = await redis.getValue(key);

  if (!result) {
    result = await db.getLogos();
    await redis.setValue(key, result, timeout);
  }
  return result ? result : [];
}

const updatePlayerGameStats = async (id, playerGameStats) => {


  notifications.send(`Player Game Stats Updated! \n\n ${JSON.stringify(playerGameStats, 0, 1)}`);

  // Clear Redis
  let key = cKeys.seasonSchedule;
  await redis.deleteKey(key);
  await db.updatePlayerGameStats(id, playerGameStats);
}

module.exports = {
  getSeasonSchedule,
  getTournamentSchedules,
  updateTournament,
  getRoster,
  checkForUpdates,
  getNextGames,
  clearTournamentScheduleCache,
  getLastGameResults,
  getLeagues,
  clearAllCache,
  updateGame,
  createGame,
  getLogos,
  updatePlayerGameStats
}