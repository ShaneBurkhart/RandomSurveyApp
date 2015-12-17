'use strict'

var db = require('../models/db.js');
var Sequelize = db.Sequelize;
var Promise = Sequelize.Promise;
var Question = db.question;
var Answer = db.answer;

var QuestionController = {
  // Shows a random survey question that the user has not seen yet.
  show: function(req, res) {
    var alreadySeen = req.cookies.alreadySeen || [];
    findRandomQuestion(alreadySeen).then(function(q) {
      res.render('question/show', {
        question: q
      });
    });
  },

  answer: function(req, res) {
    var questionId = req.params.id;
    var answerId = req.body.answerId;

    Question.findById(questionId, {
      include: [db.answer]
    }).then(function(q) {
      if(!q || !questionHasAnswerId(q, answerId)) {
        res.status(404).json({});
        return;
      }

      return updateStats(questionId, answerId).then(function() {
        var alreadySeen = req.cookies.alreadySeen || [];
        alreadySeen.push(questionId);
        res.cookies.alreadySeen = alreadySeen;

        return findRandomQuestion(alreadySeen);
      }).then(function(newQ) {
        res.json({ question: newQ });
      });
    })
  }
}

var updateStats = function(qId, aId) {
  return Promise.settle([
    Question.update(
      { timesAnswered: Sequelize.literal('timesAnswered+1') },
      { where: { id: qId } }
    ),
    Answer.update(
      { timesAnswered: Sequelize.literal('timesAnswered+1') },
      { where: { id: aId } }
    )
  ]);
};

var questionHasAnswerId = function(question, answerId) {
  for(var i = 0; i < question.answers.length; i++) {
    if(question.answers[i].id === answerId) {
      return true;
    }
  }
  return false;
};

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
