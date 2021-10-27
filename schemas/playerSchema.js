
'use strict';

const playerSchema = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    firstName: {type: ['string', 'null']},
    lastName: {type: ['string', 'null']},
    birthDate: {type: ['string', 'null']},
    number: {type: ['number', 'null']},
  },
  additionalProperties: false
}

module.exports = {
  "type": "array",
  "items" : playerSchema
}