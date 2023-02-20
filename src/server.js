'use strict';

const express = require('express');

const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');

const authRouter = require('./auth/routes');
const v2Routes = require('./routes/v2');

const app = express();

app.use(express.json());
app.use(logger);

app.use(authRouter);
app.use(v2Routes);

app.get('/', (req, res, next) => {
  try {
    res.status(200).send('Welcome to Project Tracker! \n POST /signup to make an account. \n POST /projects to begin tracking a project. \n GET /projects to see how you\'re doing! \n\n Projects are JSON with 3 properties: \n 1. name (string) \n 2. description (string) \n 3. completionPercent  (integer between 0 and 100)')
  } catch (error) {
    next(error)
  }
});

app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error('Missing Port'); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
