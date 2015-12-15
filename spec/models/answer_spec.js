'use strict'

var db = require('../../models/db.js');
var Answer = db.answer;
var Question = db.question;

describe('Answer', function() {
  it('saves a record correctly', function(done) {
    var answer = Answer.build({
      answer: 'Some answer',
      questionId: 1
    });

    answer.save().then(function(q) {
      expect(q.isNewRecord).toBe(false);
      done();
    }).catch(function(err) {
      expect(err).toBeUndefined();
      done();
    });
  })

  it('belongs to a question', function(done) {
    var question = Question.build({
      question: "How are you?"
    });

    question.save().then(function(q) {
      return Answer.build({
        answer: 'Some answer',
        questionId: q.id
      }).save();
    }).then(function(a) {
      expect(a.isNewRecord).toBe(false);
      expect(a.getQuestion()).not.toBeUndefined();
      done();
    }).catch(function(err) {
      expect(err).toBeUndefined();
      done();
    });
  });

  it('doesn\'t allow null answer', function(done) {
    var answer = Answer.build({
      answer: null,
      questionId: 1
    });

    // We have to actually save the record to check the allowNull validation.  It isn't
    // an instance validator and instead a Schema validator, so it doesn't fail until we
    // try to save to the db.
    answer.save().then(function(q) {
      // This is just to get a more clear error message. If we get here, the
      // test has failed.
      expect(q).not.toBeUndefined();
      done();
    }).catch(function(err) {
      expect(err).not.toBeUndefined();
      done();
    });
  });

  it('doesn\'t allow empty answer', function(done) {
    var answer = Answer.build({
      answer: '',
      questionId: 1
    });

    answer.validate().then(function(errors) {
      expect(errors).not.toBeUndefined();
      done();
    });
  });

  it('doesn\'t allow null questionId', function(done) {
    var answer = Answer.build({
      answer: 'Some answer',
      questionId: null
    });

    // We have to actually save the record to check the allowNull validation.  It isn't
    // an instance validator and instead a Schema validator, so it doesn't fail until we
    // try to save to the db.
    answer.save().then(function(q) {
      // This is just to get a more clear error message. If we get here, the
      // test has failed.
      expect(q).not.toBeUndefined();
      done();
    }).catch(function(err) {
      expect(err).not.toBeUndefined();
      done();
    });
  });

  it('doesn\'t allow questionId less than 1', function(done) {
    var answer = Answer.build({
      answer: 'Some answer',
      questionId: 0
    });

    answer.validate().then(function(errors) {
      expect(errors).not.toBeUndefined();
      done();
    });
  });
});
