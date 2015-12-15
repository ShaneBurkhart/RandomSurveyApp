'use strict';

module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define('question', {
    question: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Question.hasMany(models.answer);
      }
    }
  });
  return Question;
};
