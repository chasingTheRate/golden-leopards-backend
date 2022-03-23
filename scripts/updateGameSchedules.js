const ical = require('node-ical');
const axios = require('axios');
const Airtable = require('airtable');
const _ = require('lodash');

const API_KEY = process.env.AIRTABLE_API_KEY;
const TOURNAMENT_AIRTABLE_BASE_ID = process.env.TOURNAMENT_AIRTABLE_BASE_ID;

var base = new Airtable({apiKey: API_KEY}).base(TOURNAMENT_AIRTABLE_BASE_ID);

const isNewGame = (key, existingGames) => {
  const exists = existingGames.filter(g => g.uid === key);
  return exists.length === 0;
}

const gameRequiresUpdate = (key, incomingGame, existingGames) => {
  const requiresUpdate = existingGames.filter(g => ((g.uid === key) && (incomingGame.dtstamp.toISOString() !== g.dtstamp )));
  return requiresUpdate.length > 0 ? requiresUpdate[0].id : null;
}

const getAdditionalFields = (description) => {
  const splitDescription = description.split('\n');
  const teams = splitDescription[0].split(' @ ');
  const awayTeam = teams[0];
  const homeTeam = teams[1];
  const opponent = (homeTeam === 'Dash Woodlands 2010/11 - Johnson 2' || homeTeam === 'Dash Woodlands 2010/11 - Johnson 1') ? awayTeam : homeTeam;
  const arriveTime = splitDescription[1];
  const field = splitDescription[2];

  return {
    awayTeam,
    homeTeam,
    opponent,
    arriveTime,
    field
  }
}

const getCalendars = async () => {

  let gamesToCreate = [];
  let gamesToUpdate = [];

  let existingGames = await base('games').select().firstPage();

  existingGames = existingGames.map(r => {
    r.fields.id = r.id;
    return Object.assign({}, r.fields);
  });

  const urls = [
    'https://api.playmetrics.com/calendar/146/team/32919-39BF312A.ics?filter=games',
    'https://api.playmetrics.com/calendar/146/team/32920-6B075F7F.ics?filter=games'
  ]

  let incomingGames = {};

  for await (const url of urls) {
    let result = await ical.async.fromURL(url);
    incomingGames = {...incomingGames, ...result};
  }

  for (let [key, value] of Object.entries(incomingGames)) {
    
    if (value.type !== 'VEVENT') {
      continue;
    }

    const isNew = isNewGame(key, existingGames);
    let requiresUpdateId = null;

    if (!isNew) {
      requiresUpdateId = gameRequiresUpdate(key, value, existingGames);
    } 

    if (isNew) {
       const additionalFields = getAdditionalFields(value.description);
       value.params = null;
       value = {...value, ...additionalFields}
       gamesToCreate.push({fields: value});
    } else if (!isNew && requiresUpdateId) {
        const additionalFields = getAdditionalFields(value.description);
        value.params = null;
        value = {...value, ...additionalFields}
        gamesToUpdate.push({id: requiresUpdateId, fields: value});
    }
  };

  if (gamesToCreate.length > 0) {

    const gamesToCreateChunks = _.chunk(gamesToCreate, 10);

    for await (const games of gamesToCreateChunks) {
      const results = await base('games').create(games);
    }
  }

  if (gamesToUpdate.length > 0) {
  
    const gamesToUpdateChunks = _.chunk(gamesToUpdate, 10);

    for await (const games of gamesToUpdateChunks) {
      const results = await base('games').update(games);
    }
  }

  return {
    gamesUpdated: gamesToUpdate.length,
    gamesCreated: gamesToCreate.length
  }
}

module.exports = {
  getCalendars
}
