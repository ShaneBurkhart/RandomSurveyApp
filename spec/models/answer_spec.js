'use strict'

var db = require('../../models/db.js');
var Answer = db.answer;
var Question = db.question;

describe('Answer', function() {
  beforeEach(function(done) {
    Question.destroy({ where: {} }).then(done);
  });

  it('saves a record correctly', function(done) {
    this.createDefaultAnswer(1).then(function(a) {
      expect(a.isNewRecord).toBe(false);
      done();
    }).catch(this.createCheckHasNoErrorsCallback(done));
  })

  it('belongs to a question', function(done) {

    this.createDefaultQuestionWithAnswers().then(function(q) {
      var answer = q.answers[0];
      expect(answer.isNewRecord).toBe(false);
      expect(answer.getQuestion()).not.toBeUndefined();
      done();
    }).catch(this.createCheckHasNoErrorsCallback(done));
  });

  it('doesn\'t allow null answer', function(done) {
    this.checkAnswerIsNotValid(null, 1, done);
  });

  it('doesn\'t allow empty answer', function(done) {
    this.checkAnswerIsNotValid('', 1, done);
  });

  it('doesn\'t allow null questionId', function(done) {
    this.checkAnswerIsNotValid('Yes', null, done);
  });

  it('doesn\'t allow questionId less than 1', function(done) {
    this.checkAnswerIsNotValid('Yes', 0, done);
  });
});
