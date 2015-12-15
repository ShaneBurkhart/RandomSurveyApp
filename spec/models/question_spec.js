'use strict'

var db = require('../../models/db.js');

var Answer = db.answer;
describe('Question', function() {
  it('saves a record correctly', function(done) {
    this.createDefaultQuestion('My name is Ron Burgundy?').then(function(q) {
      expect(q.isNewRecord).toBe(false);
      done();
    }).catch(this.createCheckHasNoErrorsCallback(done));
  });

  it('has many answers', function(done) {
    var question;
    var self = this;
    this.createDefaultQuestion().then(function(q) {
      // There is probably a better way to save the question for later promises,
      // but this will do for now.
      question = q;
      return self.createAnswer('Some answer', question.id);
    }).then(function(a1) {
      return self.createAnswer('Some other answer', question.id);
    }).then(function(a2) {
      return question.getAnswers();
    }).then(function(answers) {
      expect(answers.length).toBe(2);
      done();
    }).catch(this.createCheckHasNoErrorsCallback(done));
  });

  it('doesn\'t allow null questions', function(done) {
    this.checkQuestionIsNotValid(null, done);
  });

  it('doesn\'t allow empty questions', function(done) {
    this.checkQuestionIsNotValid('', done);
  });
});
