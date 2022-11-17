'use strict'
const _ = require('lodash');

const addedOrRemoved = (previousValue, newValue) => { 
  return {
    added: _.difference(newValue, previousValue),
    removed: _.difference(previousValue, newValue)
  }
}

module.exports =  {
  addedOrRemoved
}