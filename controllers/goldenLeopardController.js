const airtableDb = require('../db/airtable');
const scripts = require('../scripts');
const moment = require('moment');
const _ = require('lodash');
const redis = require('../db/redis');

const cKeys = require('../util/cacheKeys');

const getSeasonSchedule = async () => {

  let key = 'seasonSchedule';
  let timeout = 21600; //seconds

  let result = await redis.getValue(key);

  if (!result) {
    result = await airtableDb.getSeasonSchedule();
    await redis.setValue(key, result, timeout);
  } 

  return result ? result : [];

}

const getTournamentSchedules = async () => {

  let key = 'tournamentSchedules';
  let timeout = 21600; //seconds
  let result = null;

  try {

    result = await redis.getValue(key);

    if (!result) {
      result = await airtableDb.getTournamentSchedules();
      await redis.setValue(key, result, timeout);
    }

    return result ? result : [];

  } catch (e) {
    console.error(e);
    return [];
  }
}

const updateTournament = async (id, tournament) => {

  let key = 'tournamentSchedules';
  const result = await airtableDb.updateTournament(id, tournament);

  // Clear Redis
  await redis.deleteKey(key);

  return result ? result : [];
}

const getRoster = async () => {

  let key = 'roster';
  let timeout = 21600; //seconds

  let result = await redis.getValue(key);

  if (!result) {
    result = await airtableDb.getRoster();
    await redis.setValue(key, result, timeout);
  }

  return result ? result : [];

}

const checkForUpdates = async () => {
  return scripts.getCalendars();
}

const getNextGames = async () => {

  let key = 'nextGames';
  let timeout = 21600; //seconds

  let result = await redis.getValue(key);

  if (!result) {
    result = await airtableDb.getNextGames();
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

const clearTournamentScheduleCache = async () => {

  let key = cKeys.tournamentSchedules;

  return await redis.deleteKey(key);
}

const getLastGameResults = async () => {
  
  let key = cKeys.lastGameResults;
  let timeout = 21600; //seconds

  let result = await redis.getValue(key);

  if (!result) {
    result = await airtableDb.getLastGameResults();
    console.log(result);
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

module.exports = {
  getSeasonSchedule,
  getTournamentSchedules,
  updateTournament,
  getRoster,
  checkForUpdates,
  getNextGames,
  clearTournamentScheduleCache,
  getLastGameResults
}