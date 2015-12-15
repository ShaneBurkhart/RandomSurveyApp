'use strict';

module.exports = function(sequelize, DataTypes) {
  var Answer = sequelize.define('answer', {
    answer: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    questionId: {
      type: DataTypes.INTEGER,
      validate: {
        isGreaterThan: function(val) {
          if(val < 1) {
            throw new Error('QuestionId can\'t be less than 1');
          }
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Answer.belongsTo(models.question, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return Answer;
};
