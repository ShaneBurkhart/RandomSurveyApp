'use strict';

var db = require('../models/db.js');
var Question = db.question;
var Answer = db.answer;

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Sequelize.Promise.settle([
      createQuestionWithAnswersPromise("Do you like pizza?", Sequelize),
      createQuestionWithAnswersPromise("Do you own a dog?", Sequelize),
      createQuestionWithAnswersPromise("Do you own a cat?", Sequelize)
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Sequelize.questions.destroy({ where: {} });
  }
};

var createQuestionWithAnswersPromise = function(question, Sequelize) {
  return Question.create({ question: question }).then(function(q) {
    return Sequelize.Promise.settle([
      Answer.create({ answer: 'Yes', questionId: q.id }),
      Answer.create({ answer: 'No', questionId: q.id }),
      Answer.create({ answer: 'Maybe', questionId: q.id })
    ]);
  });
};
