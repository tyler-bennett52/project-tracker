'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const projectModel = require('./project/model');

const userModel = require('../auth/models/users')
const Collection = require('./data-collection.js');

const DATABASE_URL = process.env.NODE_ENV === 'test' ? 'sqlite:memory:' : process.env.DATABASE_URL;

const sequelize = new Sequelize(DATABASE_URL);

const projects = projectModel(sequelize, DataTypes);
const users = userModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  projects: new Collection(projects),
  users: users,
};
