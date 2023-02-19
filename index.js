'use strict';

require('dotenv').config();
const app = require('./src/server.js');
const { db } = require('./src/models/index');

db.sync().then(() => {
  app.start(process.env.PORT || 3001);
});
