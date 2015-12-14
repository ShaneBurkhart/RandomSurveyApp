'use strict'

var db = require('../../models/db.js');
var Question = db['Question'];

describe('question', function() {
  it('saves a record correctly', function(done) {
    var question = Question.build({
      question: 'What is your name?'
    });

    question.save().then(function(q) {
      expect(q.isNewRecord).toBe(false);
      done();
    }).catch(function(err) {
      expect(err).toBeUndefined();
      done();
    });
  })

  it('doesn\'t allow null questions', function(done) {
    var question = Question.build({
      question: null
    });

    // We have to actually save the record to check the allowNull validation.  It isn't
    // an instance validator and instead a Schema validator, so it doesn't fail until we
    // try to save to the db.
    question.save().then(function(q) {
      // This is just to get a more clear error message. If we get here, the
      // test has failed.
      expect(q).toBeUndefined();
      done();
    }).catch(function(err) {
      expect(err).not.toBeUndefined();
      done();
    });
  })

  it('doesn\'t allow empty questions', function(done) {
    var question = Question.build({
      question: ''
    });

    question.validate().then(function(errors) {
      expect(errors).not.toBeUndefined();
      done();
    });
  })
});
