
var Airtable = require('airtable');
const axios = require('axios');

// INPUTS

const API_KEY = process.env.AIRTABLE_API_KEY;
const tableName = '2021F Game 6.1';
const gameId = '752b2e30-7e30-4c71-94c8-5d5a5b50861b';
const segmentDuration = 10;

Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: API_KEY
});

var base = Airtable.base('appHqUWGiYZmbqs9T');

const positions = [
  'Left Striker',
  'Right Striker',
  'Left Midfield',
  'Center Midfield',
  'Right Midfield',
  'Left Defense',
  'Center Defense',
  'Right Defense',
  'Goalie'
];

const recordFields = [];
const gameSegments = [];

base(tableName).select({
  // Selecting the first 3 records in Grid view:
  //maxRecords: 3,
  view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
  // This function (`page`) will get called for each page of records.
  records.forEach((record) => {
      const { fields } = record;
      if (positions.includes(fields.Name)) {
        recordFields.push(fields);
      }
      //console.log(record);
      //console.log('Retrieved', record.get('Name'));
  });

  // To fetch the next page of records, call `fetchNextPage`.
  // If there are more records, `page` will get called again.
  // If there are no more records, `done` will get called.
  fetchNextPage();

}, async (err) => {

  if (recordFields.length !== 9) {
    console.error(new Error("Expect 9 records"));
    return;
  }

  const results = await axios.get('http://localhost:3000/api/players');
  const players = results.data;

  //console.log(players);

  recordFields.forEach(f => {
    Object.keys(f).forEach((key, index) => {

      const halfSegment = parseInt(key.slice(key.length - 1, key.length));
      const half = parseInt(key.slice(key.length - 3, key.length));

      if (!(Number.isInteger(halfSegment) && Number.isInteger(half))) return;

      //console.log(f[key]);

      const playerInfo = f[key].split(',');

      const playerName = playerInfo[0] ? playerInfo[0].trim() : null;
      const goals = playerInfo[1] ? parseInt(playerInfo[1].trim()) : 0;
      const assists = playerInfo[2] ? parseInt(playerInfo[2].trim()) : 0;
      const saves = playerInfo[3] ? parseInt(playerInfo[3].trim()) : 0;
      const goalsAllowed = playerInfo[4] ? parseInt(playerInfo[4].trim()) : 0;

      const player = players.filter(p => p.firstName === playerName)

      if (player.length != 1) {
        console.error(`Player Name: ${playerName} not recognized`);
        throw new Error(`Player Name: ${playerName} not recognized`);
      }

      gameSegments.push({
        position: f.Name,
        startingTimeInMinutes: 10 * halfSegment + 30 * (half - 1) - 10,
        duration: segmentDuration,
        playerId: player[0] ? player[0].id : null,
        gameId,
        goals,
        assists,
        saves,
        goalsAllowed
      })
    });
  })
  //console.log(gameSegments);

  const postResults = await axios.post('http://localhost:3000/api/gameSegments', gameSegments);

  console.log(postResults.status);

  if (err) { console.error(err); return; }
});
