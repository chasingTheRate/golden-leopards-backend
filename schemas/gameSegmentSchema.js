
'use strict';

const playerSchema = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    position: {type: ['string']},
    gameId: {type: ['string']},
    playerId: {type: ['string']},
    goals: {type: ['number', 'null']},
    assists: {type: ['number', 'null']},
    saves: {type: ['number', 'null']},
    goalsAllowed: {type: ['number', 'null']},
    startingTimeInMinutes: {type: ['number']},
    duration: {type: ['number']},
  },
  additionalProperties: false,
  required: ['position', 'gameId', 'playerId', 'startingTimeInMinutes', 'duration']
}

module.exports = {
  "type": "array",
  "items" : playerSchema
}