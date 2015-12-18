'use strict'

var db = require('../../../models/db.js');
var Answer = db.answer;

beforeEach(function() {
  this.checkAnswerIsNotValid = function(answer, qId, done) {
    this.createAnswer(answer, qId).then(function(a) {
      expect(a).toBeUndefined();
      done();
    }).catch(this.createCheckHasErrorsCallback(done));
  };

  this.createDefaultAnswer = function(qId) {
    return this.createAnswer('Yes', qId);
  };

  this.createAnswer = function(a, qId) {
    return Answer.create({
      answer: a,
      questionId: qId
    });
  };
});
