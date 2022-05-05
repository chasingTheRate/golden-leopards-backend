var Airtable = require('airtable');

const API_KEY = process.env.AIRTABLE_API_KEY;
const TOURNAMENT_AIRTABLE_BASE_ID = process.env.TOURNAMENT_AIRTABLE_BASE_ID;

var base = new Airtable({apiKey: API_KEY}).base(TOURNAMENT_AIRTABLE_BASE_ID);

const getSeasonSchedule = async () => {
  const records = await base('games').select({
    sort: [{field: "start", direction: "desc"}],
    fields: [
      'uid',
      'opponent',
      'homeTeam',
      'awayTeam',
      'field',
      'arriveTime',
      'status',
      'location',
      'start',
      'end',
      'recordedGame',
      'veoLink',
      'ourScore',
      'opponentScore',
      'leagues'
    ]
  }).firstPage();
  return records.map(r => {
    const fields = Object.assign({}, r.fields);
    fields.id = r.id;
    fields.leagues = fields.leagues[0];  
    return fields;    
  });
}

const getNextGames = async () => {
  const records = await base('games').select({
    filterByFormula: '{start} >= TODAY()',
    sort: [{field: "start", direction: "asc"}],
    fields: [
      'uid',
      'opponent',
      'homeTeam',
      'awayTeam',
      'field',
      'arriveTime',
      'status',
      'location',
      'start',
      'end',
      'recordedGame',
      'veoLink',
      'ourScore',
      'opponentScore'
    ]
  }).firstPage();
  return records.map(r => {
    const fields = Object.assign({}, r.fields);
    fields.id = r.id;
    return fields;    
  });
}

const getTournamentSchedules = async () => {
  const records = await base('Tournaments').select({
    filterByFormula: 'AND({Start Date} >= TODAY(), {hide} != 1)',
    sort: [{field: "Start Date", direction: "asc"}]
  }).firstPage();
  return records.map(r => {
    const fields = Object.assign({}, r.fields);
    fields.id = r.id;
    return fields;    
  });
}

const updateTournament = async (id, tournament) => {
  
  const records = await base('Tournaments').update([
    {
      'id': id,
      'fields': tournament
    },
  ]);

  records[0].fields.id = records[0].id 
  return records[0].fields;
}

const getRoster = async () => {
  const records = await base('players').select({
    fields: ['displayName'],
    sort: [{field: 'displayName', direction: 'asc'}]
  }).firstPage();
  return records.map(r => {
    const fields = Object.assign({}, r.fields);
    fields.id = r.id;
    return fields;
  });
}

const getLastGameResults = async () => {
  const records = await base('games').select({
    filterByFormula: '{gameStatus} = "final"',
    sort: [{field: "start", direction: "desc"}],
    fields: [
      'uid',
      'opponent',
      'homeTeam',
      'awayTeam',
      'field',
      'arriveTime',
      'status',
      'location',
      'start',
      'end',
      'recordedGame',
      'veoLink',
      'ourScore',
      'opponentScore',
      'gameStatus',
      'opponentShortName',
    ]
  }).firstPage();
  return records.map(r => {
    console.log(r);
    const fields = Object.assign({}, r.fields);
    fields.id = r.id;
    return fields;    
  });
}

const getLeagues = async () => {
  const records = await base('leagues').select({}).firstPage();
  return records.map(r => {
    const fields = Object.assign({}, r.fields);
    fields.id = r.id;
    return fields;    
  });
}

module.exports = {
  getSeasonSchedule,
  getTournamentSchedules,
  getRoster,
  updateTournament,
  getNextGames,
  getLastGameResults,
  getLeagues
}

