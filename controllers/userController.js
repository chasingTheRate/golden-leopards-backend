
const moment = require('moment');
const _ = require('lodash');
const axios = require('axios');

const getUser = async (access_token) => {

  var error = null;
  var user = {};

  try {
    const results = await axios(`https://api.groupme.com/v3/users/me?token=${access_token}`);
    const { data: { response }} = results;
    const { name, id } = response;
    user = { name, id };
  } catch (err) {
    const { response: { data: { meta: meta } }} = err;
    error = meta;
  }

  return { user, error };
}

module.exports = {
  getUser,
}