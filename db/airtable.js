var Airtable = require('airtable');

const API_KEY = process.env.AIRTABLE_API_KEY;
const TOURNAMENT_AIRTABLE_BASE_ID = process.env.TOURNAMENT_AIRTABLE_BASE_ID;

var base = new Airtable({apiKey: API_KEY}).base(TOURNAMENT_AIRTABLE_BASE_ID);

const getTournamentSchedules = async () => {
  const records = await base('Tournaments').select({
    filterByFormula: '{Start Date} >= TODAY()',
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
    fields: ['displayName']
  }).firstPage();
  return records.map(r => {
    const fields = Object.assign({}, r.fields);
    fields.id = r.id;
    return fields;
  });
}

module.exports = {
  getTournamentSchedules,
  getRoster,
  updateTournament
}

