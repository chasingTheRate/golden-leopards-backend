const { createClient } = require('redis');

var client = null;

const setValue = async (key, value, timeout) => await client.set(key, JSON.stringify(value), { EX: timeout })

const getValue = async (key) => JSON.parse(await client.get(key));

const deleteKey = async (key) => await client.del(key);

(async () => {

  client = createClient({
    url: process.env.REDIS_URL,
    socket: {
      tls: true,
      rejectUnauthorized: false
    }
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

})();

module.exports = {
  setValue,
  getValue,
  deleteKey,
}
