'use strict'

var db = require('../models/db.js');
var Sequelize = db.Sequelize;
var Promise = Sequelize.Promise;
var Question = db.question;
var Answer = db.answer;

var COOKIE_DURATION = 5 * 365 * 24 * 60 * 60 * 1000; // 5 years

var QuestionController = {
  // Shows a random survey question that the user has not seen yet.
  show: function(req, res, next) {
    var alreadySeen = req.cookies.alreadySeen || [];

    createFindRandomQuestionIdCallback()(alreadySeen)
      .then(createFindQuestionWithAnswersByIdCallback())
      .then(createRenderQuestionCallback(function(data) {
        res.render('question/show', data);
      }))
      .catch(next);
  },

  answer: function(req, res, next) {
    var questionId = req.params.id;
    var answerId = parseInt(req.body.answerId);

    createFindQuestionWithAnswersByIdCallback()(questionId)
      .then(function(question) {
        // Checking if answerId is NaN
        if(!question || !answerId || !questionHasAnswerId(question, answerId)) {
          res.status(404).json({});
          return;
        }

        return createUpdateStatsCallback(questionId, answerId)()
          .then(createUpdateAlreadySeenCallback(questionId, req, res))
          .then(createFindRandomQuestionIdCallback())
          .then(createFindQuestionWithAnswersByIdCallback())
          // Since we are passing a function, it doesn't have any reference of 'this'
          // bind sets this to the mockResponse
          .then(createRenderQuestionCallback(res.json.bind(res)))
      }).catch(next);
  }
}

var createFindRandomQuestionIdCallback = function() {
  return function(alreadySeen) {
    return Question.findAll(
      getOptionsForFindAllIdsNotSeen(alreadySeen)
    ).then(function(questions) {
      if(questions.length == 0) {
        return null;
      }
      var index = randomInt(0, questions.length);
      return questions[index].id;
    });
  };
};

var createUpdateStatsCallback = function(qId, aId) {
  return function() {
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
};

var createUpdateAlreadySeenCallback = function(questionId, req, res) {
  return function() {
    return new Promise(function(resolve, reject) {
      var alreadySeen = req.cookies.alreadySeen || [];
      alreadySeen.push(questionId);

      res.cookie('alreadySeen', alreadySeen, {
        maxAge: COOKIE_DURATION,
        httpOnly: true
      });
      resolve(alreadySeen);
    })
  };
};

var createFindQuestionWithAnswersByIdCallback = function() {
  return function(questionId) {
    return Question.findById(questionId, { include: [ Answer ] })
  };
};

var createRenderQuestionCallback = function(renderFunc) {
  return function(question) {
    renderFunc({ question: question });
  };
};

var questionHasAnswerId = function(question, answerId) {
  for(var i = 0; i < question.answers.length; i++) {
    if(question.answers[i].id === answerId) {
      return true;
    }
  }
  return false;
};

var getOptionsForFindAllIdsNotSeen = function(alreadySeen) {
  // Only get ids for speed purposes.  We can requery for the whole question and
  // include the answer.
  var findAllOptions = { attributes: [ 'id' ] };
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
