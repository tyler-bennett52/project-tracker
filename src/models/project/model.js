'use strict';

const projectModel = (sequelize, DataTypes) => sequelize.define('Project', {
  name: { type: DataTypes.STRING, required: true },
  description: { type: DataTypes.STRING, required: true },
  completionPercent: { 
    type: DataTypes.INTEGER,
    required: true,
    validate: { min: 0, max: 100 }
    
  },

});

module.exports = projectModel;