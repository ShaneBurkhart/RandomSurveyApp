'use strict';

var bcrypt = require('bcryptjs');

module.exports = function(sequelize, DataTypes) {
  var admin = sequelize.define('admin', {
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isValidEmail: function(val) {
          if(!val.match(/^\S+@\S+$/)) {
            throw new Error('Invalid email address.');
          }
        }
      }
    },
    passwordDigest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  }, {
    instanceMethods: {
      setPassword: function(password) {
        this.passwordDigest = bcrypt.hashSync(password);
      },

      comparePassword: function(password) {
        return bcrypt.compareSync(password, this.passwordDigest);
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return admin;
};
