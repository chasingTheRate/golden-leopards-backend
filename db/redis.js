const { createClient } = require('redis');

var client = null;
var redisStatus;

const setValue = async (key, value, timeout) => { 

  if (redisStatus !== 'ready') {
    return;
  }

  return await client.set(key, JSON.stringify(value), { EX: timeout })
}

const getValue = async (key) => {
  return redisStatus === 'ready' ? JSON.parse(await client.get(key)) : null;
}

const deleteKey = async (key) => await client.del(key);


(async () => {

  client = createClient({
    url: process.env.REDIS_TLS_URL,
    socket: {
      tls: true,
      rejectUnauthorized: false
    }
  });

  client.on('error', (err) => console.log('Redis Client Error', err));
  client.on('connect'     , () => { redisStatus = 'connect' });
  client.on('ready'       , () => { redisStatus = 'ready' });
  client.on('reconnecting', () => { redisStatus = 'reconnecting' });
  client.on('end'         , () => { redisStatus = 'end' });

  await client.connect();

})();

module.exports = {
  setValue,
  getValue,
  deleteKey
}
