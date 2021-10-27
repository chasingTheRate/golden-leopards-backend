
'use strict';

const gameSchema = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    weekId: {type: 'string'},
    seasonId: {type: 'string'},
    gameDate: {type: 'string'},
    startTime: {type: 'string'},
    homeOrAway: {type: 'string'},
    score: {type: 'number'},
    opposingTeamName: {type: 'string'},
    opposingTeamScore: {type: 'number'},
    weatherDescription: {type: ['string', 'null']},
    weatherTemperatureInFahrenheit: {type: ['number', 'null']},
    durationInMinutes: {type: ['number', 'null']},
    outcome: {type: ['string', 'null']},
  },
  required: ['seasonId'],
  additionalProperties: false
}

module.exports = {
  "type": "array",
  "items" : gameSchema
}