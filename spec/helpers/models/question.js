'use strict'

var createCheckHasNoErrorsCallback = function(done) {
  return function(err) {
      expect(err).toBeUndefined();
      done();
  }
};

var createCheckHasErrorsCallback = function(done) {
  return function(err) {
      expect(err).not.toBeUndefined();
      done();
  }
};
'use strict'

var db = require('../../../models/db.js');
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

  this.createDefaultQuestion = function() {
    return this.createQuestion("My name is Ron Burgundy?");
  };

  this.createQuestion = function(q) {
    return Question.create({
      question: q
    });
  };
});
