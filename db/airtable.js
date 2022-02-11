var Airtable = require('airtable');

const API_KEY = process.env.AIRTABLE_API_KEY;
var base = new Airtable({apiKey: API_KEY}).base('appZGGlJEe6kB6QHA');



const getTournamentSchedules = async () => {
  const records = await base('Tournaments').select().firstPage();
  return records.map(r => {
    const fields = Object.assign({}, r.fields);
    fields.id = r.id;
    return fields;    
  });
}

const updateTournament = async (id, tournament) => {
  const records = await base('Tournaments').select().firstPage();
  
  try {
    const test = await base('Tournaments').update([
      {
        'id': id,
        'fields': tournament
      },
    ]);
  } catch (e) {
    console.error(e);
  }
  
  return records.map(r => r.fields);
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

