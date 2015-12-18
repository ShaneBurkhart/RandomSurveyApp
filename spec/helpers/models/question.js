'use strict'

var db = require('../../../models/db.js');
var Promise = db.Sequelize.Promise;
var Question = db.question;
var Answer = db.answer;

beforeEach(function() {
  this.checkQuestionIsNotValid = function(question, done) {
    this.createQuestion(question).then(function(q) {
      expect(q).toBeUndefined();
      done();
    }).catch(this.createCheckHasErrorsCallback(done));
  };

  this.createDefaultQuestionWithAnswers = function() {
    var self = this;
    var questionId = null;

    return this.createDefaultQuestion().then(function(q) {
      questionId = q.id;
      return Promise.settle([
        self.createAnswer('Yes', questionId),
        self.createAnswer('No', questionId)
      ]);
    }).then(function(results) {
      // We are requerying for simplicity.  There is probably a way to get
      // the question with answers, but I don't know enough about Sequlize to
      // do it.  Performance doesn't matter since this is a test.
      return Question.findById(questionId, { include: [ Answer ] });
    });
  };

  this.createDefaultQuestion = function() {
    return this.createQuestion("My name is Ron Burgundy?");
  };

  this.createQuestion = function(q) {
    return Question.create({
      question: q
    });
  };
});
