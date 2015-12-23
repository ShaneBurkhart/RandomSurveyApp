'use strict'

var db = require('../../models/db.js');
var Question = db.question;

var Answer = db.answer;
describe('Question', function() {
  beforeEach(function(done) {
    Question.destroy({ where: {} }).then(done);
  });

  it('saves a record correctly', function(done) {
    this.createDefaultQuestionWithAnswers().then(function(q) {
      expect(q.isNewRecord).toBe(false);
      done();
    }).catch(this.createCheckHasNoErrorsCallback(done));
  });

  it('has many answers', function(done) {
    var self = this;

    this.createDefaultQuestionWithAnswers().then(function(q) {
      expect(q.answers.length).toBe(2);
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
