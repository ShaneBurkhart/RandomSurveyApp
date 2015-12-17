'use strict'

var db = require('../../../models/db.js');
var Promise = db.Sequelize.Promise;
var Question = db.question;

beforeEach(function() {
  this.checkQuestionIsNotValid = function(q, done) {
      Question.create({
        question: ''
      }).then(function(q) {
        expect(q).toBeUndefined();
        done();
      }).catch(this.createCheckHasErrorsCallback(done));
  };

  this.createDefaultQuestionWithAnswers = function() {
    var self = this;

    return this.createDefaultQuestion().then(function(q) {
      return Promise.settle([
        self.createAnswer('Yes', q.id),
        self.createAnswer('No', q.id)
      ]);
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
