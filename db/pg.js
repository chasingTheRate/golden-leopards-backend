
const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.PG_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  }
});

const getTournaments = async () => await knex('v_tournaments').then();

const updateTournament = async(id, tournament) => {
  
  // const records = await base('Tournaments').update([
  //   {
  //     'id': id,
  //     'fields': tournament
  //   },
  // ]);

  // records[0].fields.id = records[0].id 
  // return records[0].fields;
}

module.exports = {
  getTournaments
}