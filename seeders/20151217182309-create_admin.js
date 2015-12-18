'use strict';

var db = require('../models/db.js');
var Admin = db.admin;

module.exports = {
  up: function (queryInterface, Sequelize) {
    var admin = Admin.build({ email: 'admin@surveyapp.com' });
    admin.setPassword('password');
    return admin.save();
  },

  down: function (queryInterface, Sequelize) {
    return Admin.destroy({ where: {} });
  }
};
