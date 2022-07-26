const airtableDb = require('../db/airtable');
const db = require('../db/pg');

const scripts = require('../scripts');
const moment = require('moment');
const _ = require('lodash');
const redis = require('../db/redis');

const cKeys = require('../util/cacheKeys');

const getSeasonSchedule = async () => {

  let key = cKeys.seasonSchedule;
  let timeout = 21600; //seconds

  let result = await redis.getValue(key);

  if (!result) {
    const [games, leagues] = await Promise.all([db.getGames(), db.getLeagues()]);

    result = _.chain(games)
      .groupBy('leagueid')
      .map((value, key) => {
        return { league: leagues.find(l => l.id === key), games: value}
      })
      .value();

    await redis.setValue(key, result, timeout);
  } 

  return result ? result : [];

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

const updateTournament = async (id, tournament) => await db.updateTournament(id, tournament);

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
    result = result[0];
    await redis.setValue(key, result, timeout);
  }

  return result ? result : [];
}

const clearTournamentScheduleCache = async () => {

  let key = cKeys.tournamentSchedules;

  return await redis.deleteKey(key);
}

const clearAllCache = async () => {
  await redis.deleteKey(cKeys.seasonSchedule);
  await redis.deleteKey(cKeys.lastGameResults);
  await redis.deleteKey(cKeys.nextGames);
  await redis.deleteKey(cKeys.leagues);
  await redis.deleteKey(cKeys.tournamentSchedules);
  await redis.deleteKey(cKeys.roster);
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
  clearAllCache
}