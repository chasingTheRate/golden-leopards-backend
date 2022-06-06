'use strict';
const axios = require('axios');
const url = process.env.SLACK_INCOMING_WEBHOOK_URL;

const send = async(message) => {
  try {
    await axios.post(url, {
        text: message
    })
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  send
}