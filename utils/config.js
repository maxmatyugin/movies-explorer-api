const rateLimit = require('express-rate-limit');

const DB_ADRESS = 'mongodb://localhost:27017/bitfilmsdb';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

module.exports = {
  DB_ADRESS, limiter,
};
