
'use strict';

const seasonSchema = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    year: {type: 'string'},
    season: {type: 'string'},
  },
  required: ['year', 'season'],
  additionalProperties: false
}

module.exports = {
  "type": "array",
  "items" : seasonSchema
}