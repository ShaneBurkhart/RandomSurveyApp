'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

var database = process.env.DATABASE || config['database'];
var user = process.env.DB_USER || config['username'];
var password = process.env.DB_PASSWORD || config['password'];
var host = process.env.DB_HOST || config['host'];
var port = process.env.DB_PORT || config['port'];
var dialect = process.env.DB_DIALECT || config['dialect'];

var sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: dialect,
  port: port,
  logging: false
});

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
