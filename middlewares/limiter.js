const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  max: 15,
  windowMs: 60 * 1000,
});

module.exports = limiter;
