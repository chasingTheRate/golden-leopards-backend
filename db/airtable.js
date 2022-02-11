var Airtable = require('airtable');

const API_KEY = process.env.AIRTABLE_API_KEY;
var base = new Airtable({apiKey: API_KEY}).base('appZGGlJEe6kB6QHA');



const getTournamentSchedules = async () => {
  const records = await base('Tournaments').select().firstPage();
  return records.map(r => r.fields);
}

const getRoster = async () => {
  const records = await base('players').select({
    fields: ['Id', 'displayName']
  }).firstPage();
  return records.map(r => r.fields);
}

module.exports = {
  getTournamentSchedules,
  getRoster
}

