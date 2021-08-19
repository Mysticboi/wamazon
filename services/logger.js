const logger = require('pino')({
  prettyPrint: {
    ignore: 'pid,hostname',
    timestampKey: 'time',
  },
});

module.exports = logger;
