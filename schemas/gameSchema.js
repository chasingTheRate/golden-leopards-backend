
'use strict';

const gameSchema = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    weekId: {type: 'string'},
    seasonId: {type: 'string'},
    gameDate: {type: ['string', 'null']},
    startTime: {type: ['string', 'null']},
    homeOrAway: {type: ['string', 'null']},
    score: {type: ['number', 'null']},
    opposingTeamName: {type: ['string', 'null']},
    opposingTeamScore: {type: ['number', 'null']},
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