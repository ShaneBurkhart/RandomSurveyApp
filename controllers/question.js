'use strict'

var db = require('../models/db.js');
var Question = db.question;

var QuestionController = {
  // Shows a random survey question that the user has not seen yet.
  show: function(req, res) {
    var alreadySeen = req.cookies.alreadySeen || [];
    findRandomQuestion(alreadySeen).then(function(q) {
      res.render('question/show', {
        question: q
      });
    });
  }
}

var findRandomQuestion = function(alreadySeen) {
  return Question.findAll(
    getOptionsForFindAllIdsNotSeen(alreadySeen)
  ).then(function(questions) {
    if(questions.length == 0) {
      return null;
    }
    var index = randomInt(0, questions.length);
    return questions[0];
  });
};

var getOptionsForFindAllIdsNotSeen = function(alreadySeen) {
  var findAllOptions = {};
  if(alreadySeen.length > 0) {
    findAllOptions.where = {
      id: { $notIn: alreadySeen }
    }
  }
  return findAllOptions;
};

var randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};

module.exports = QuestionController;
