const airtableDb = require('../db/airtable');
const db = require('../db/pg');

const scripts = require('../scripts');
const moment = require('moment');
const _ = require('lodash');
const redis = require('../db/redis');

const notifications = require('../util/notifications');
const cKeys = require('../util/cacheKeys');
const tournaments = require('../util/tournaments')

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

    const scheduledGames = games.filter(g => g.gamestatus === 'scheduled').sort((a,b) => a.start - b.start );
    const finalGames = games.filter(g => g.gamestatus !== 'scheduled').sort((a,b) => b.start - a.start );

    const sortedGame = [...scheduledGames, ...finalGames];

  
    const groupedPlayerGameStatsByGameId = _.chain(playerGameStats)
      .groupBy('game_id')
      .value();

    result = _.chain(sortedGame)
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

const createTournament = async (tournament) => {

  // Clear Redis
  let key = cKeys.tournamentSchedules;
  await redis.deleteKey(key);

  await db.createTournament(tournament)

  notifications.send(`Tournament Created! \n\n ${JSON.stringify(tournament, 0, 1)}`);
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

const updateTournamentPlayers = async (id, tournament) => {

  // Clear Redis
  let key = cKeys.tournamentSchedules;
  await redis.deleteKey(key);

  // Determine Players Added/Removed
  const { player_ids = [] } = await db.getTournamentById(id);
  const oldPlayer_ids = player_ids 
    ? player_ids.split(',').map(p => p.trim())
    : []

  await db.updateTournamentPlayers(id, tournament);

  const { added = [], removed = [] } = tournaments.addedOrRemoved(oldPlayer_ids, tournament.player_ids || []);

  var addedPlayerNames = await db.getPlayersByIds(added);
  var removedPlayerNames = await db.getPlayersByIds(removed);
  addedPlayerNames = addedPlayerNames.map(p => p.displayname).join(', ');
  removedPlayerNames = removedPlayerNames.map(p => p.displayname).join(', ');

  notifications.send(`Tournament Updated!\n\n${tournament.name}\nAdded: ${addedPlayerNames}\nRemoved: ${removedPlayerNames}`);
}

const updateTournament = async (id, tournament) => {

  // Clear Redis
  let key = cKeys.tournamentSchedules;
  await redis.deleteKey(key);

  delete tournament.id;
  delete tournament.players;
  delete tournament.player_ids;

  await db.updateTournament(id, tournament);

  notifications.send(`Tournament Updated!\n\n${tournament.name}`);
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
  await redis.deleteKey(cKeys.leagues);
  await redis.flushAll();
}


const getLastGameResults = async () => {
  
  let key = cKeys.lastGameResults;
  let timeout = 21600; //seconds

  let result = await redis.getValue(key);

  
  if (!result) {
    
    result = await db.getLastGameResults();

    const [
      lastGameResults, 
      playerGameStats,
    ] = await Promise.all([
      db.getLastGameResults(),
      db.getPlayerGameStats()
    ]);

    const groupedPlayerGameStatsByGameId = _.chain(playerGameStats)
      .groupBy('game_id')
      .value();

    result = lastGameResults.map(g => {
      g.playerStats = groupedPlayerGameStatsByGameId[g.id] || [];
      return g;
    })
    
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

const createLeague = async (league) => {

  // Clear Redis
  let key = cKeys.leagues;
  await redis.deleteKey(key);

  const result = await db.createLeague(league);

  notifications.send(`League Created! \n\n ${JSON.stringify(league, 0, 1)}`);

  return result ? result : null;
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

const updateLeague = async (id, league) => {

  const tempLeague = Object.assign({}, league);

  delete tempLeague.logoheight;
  delete tempLeague.logowidth;
  delete tempLeague.logofilename;

  notifications.send(`League Updated! \n\n ${JSON.stringify(tempLeague, 0, 1)}`);

  // Clear Redis
  let key = cKeys.leagues;
  await redis.deleteKey(key);
  await db.updateLeague(id, tempLeague);
}

const getLeagueSchedule = async (id) => {
  
  // Add redis stuff here.....how to delete dynamic keys?

  const [
    games, 
    league,
    cumlativePlayerGameStats
  ] = await Promise.all([
    db.getLeagueSchedule(id),
    db.getLeague(id),
    db.getCumlativePlayerGameStatsByLeague(id)
  ]);

  const scheduledGames = games.filter(g => g.gamestatus === 'scheduled').sort((a,b) => a.start - b.start );
  const finalGames = games.filter(g => g.gamestatus !== 'scheduled').sort((a,b) => b.start - a.start );

  const sortedGames = [...scheduledGames, ...finalGames];

  const result = {games: sortedGames, league: league ? league[0] : null, cumlativePlayerGameStats}
  
  return result ? result : [];
}

const getPlayersWithCurrentStats = async () => {

  let key = cKeys.playersWithCurrentStats;
  let timeout = 21600; //seconds

  let result = await redis.getValue(key);

  if (!result) {
    result = await db.getPlayersWithCurrentStats()
    await redis.setValue(key, result, timeout);
  }
  
  return result ? result : [];
}

const getPlayerStatsByPlayerId = async ({ id, year, leagueId }) => {

  //let key = cKeys.playersWithCurrentStats;
  //let timeout = 21600; //seconds

  let result //= await redis.getValue(key);

  if (!result) {

    if (leagueId && leagueId != 'undefined') {
      return db.getLeaguePlayerStatsByPlayerId(id, leagueId);
    }

    if (year && year != 'undefined') {
      return db.getAnnualPlayerStatsByPlayerId(id, year);
    }

    result = await db.getYearlyPlayerStatsByPlayerId(id)
    //await redis.setValue(key, result, timeout);
  }

  return result ? result : [];
}

const getPlayerById = async (id) => {

  //let key = cKeys.playersWithCurrentStats;
  //let timeout = 21600; //seconds

  let result //= await redis.getValue(key);

  if (!result) {

    result = await db.getPlayerById(id)
    //await redis.setValue(key, result, timeout);
  }

  return result ? result[0] : {};
}

module.exports = {
  getSeasonSchedule,
  getTournamentSchedules,
  createTournament,
  updateTournamentPlayers,
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
  updatePlayerGameStats,
  createLeague,
  updateLeague,
  getLeagueSchedule,
  getPlayersWithCurrentStats,
  getPlayerStatsByPlayerId,
  getPlayerById
}