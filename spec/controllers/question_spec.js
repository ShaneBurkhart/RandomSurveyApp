'use strict'

var QuestionController = require('../../controllers/question.js');
var db = require('../../models/db.js');
var Question = db.question;

describe('QuestionController', function() {
  describe('#show', function() {
    beforeEach(function(done) {
      var self = this;

      Question.destroy({ where: {} }).then(function() {
        return self.createDefaultQuestion();
      }).then(done);
    });

    it('shows a question', function(done) {
      QuestionController.show(
        createMockRequest(),
        createMockReponse('question/show', true, done)
      );
    });

    it('doesn\'t show the same question twice', function(done) {
      // If there is only one question, and we mark it as already seen,
      // there shouldn't be a question in the response.
      Question.findOne().then(function(q) {
        var mockRequest = createMockRequest();
        mockRequest.cookies.alreadySeen = [ q.id ];

        QuestionController.show(
          mockRequest,
          createMockReponse('question/show', false, done)
        );
      });
    });
  })

  describe('#answer', function() {
    it('responds with a 404 when the questionId isn\t found', function() {
      expect(true).toBe(false);
    });

    it('responds with a 404 when the answerId doesn\'t belong to the question', function() {
      expect(true).toBe(false);
    });

    it('returns a new question on success', function() {
      expect(true).toBe(false);
    });

    it('increments stats for timesAnswered and timesAsked', function() {
      expect(true).toBe(false);
    });
  });
});

var createMockRequest = function() {
  return {
    cookies: {}
  }
};

var createMockReponse = function(view, hasQuestion, done) {
  return {
    render: function(view, data, callback) {
      expect(view).toEqual('question/show');
      if(hasQuestion) {
        expect(data.question).not.toBeUndefined();
        expect(data.question.Model.name).toEqual('question');
      } else {
        expect(data.question).toBeNull();
      }
      done();
    }
  };
};
