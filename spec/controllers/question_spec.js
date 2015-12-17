'use strict'

var QuestionController = require('../../controllers/question.js');
var db = require('../../models/db.js');
var Question = db.question;

describe('QuestionController', function() {
  beforeEach(function(done) {
    var self = this;

    Question.destroy({ where: {} }).then(function() {
      return self.createDefaultQuestionWithAnswers();
    }).then(done);
  });

  describe('#show', function() {
    it('shows a question', function(done) {
      QuestionController.show(
        createMockRequest(),
        createMockResponse('question/show', true, false, 200, done)
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
          createMockResponse('question/show', false, false, 200, done)
        );
      });
    });
  })

  describe('#answer', function() {
    it('responds with a 404 when the questionId isn\t found', function(done) {
      var mockRequest = createMockRequest();
      var mockResponse = createMockResponse(null, false, false, 404, done);
      // Zero should never be an id.
      mockRequest.params.id = 0;

      QuestionController.answer(mockRequest, mockResponse);
    });

    it('responds with a 404 when the answerId doesn\'t belong to the question', function(done) {
      var mockRequest = createMockRequest();
      var mockResponse = createMockResponse(null, false, false, 404, done);

      Question.findOne().then(function(q) {
        mockRequest.params.id = q.id;
        // Zero should never be an id.
        mockRequest.body.answerId = 0;
        QuestionController.answer(mockRequest, mockResponse);
      });
    });

    it('returns a question on success', function(done) {
      var mockRequest = createMockRequest();
      var mockResponse = createMockResponse(null, true, true, 200, done);

      // BeforeEach creates only one question.  For this test, we want two so that
      // one is returned.  We'll use the question we just created to make the request.
      this.createDefaultQuestionWithAnswers().then(function(q) {
        return Question.findOne({ include: [db.answer] });
      }).then(function(q) {
        mockRequest.params.id = q.id;
        mockRequest.body.answerId = q.answers[0].id;
        QuestionController.answer(mockRequest, mockResponse);
      });
    });

    it('returns an empty object when there aren\'t anymore questions', function(done) {
      var mockRequest = createMockRequest();
      var mockResponse = createMockResponse(null, false, false, 200, done);

      Question.findOne({ include: [db.answer] }).then(function(q) {
        // Zero should never be an id.
        mockRequest.params.id = q.id;
        mockRequest.body.answerId = q.answers[0].id;

        QuestionController.answer(mockRequest, mockResponse);
      });
    });

    it('increments stats for timesAnswered and timesAsked', function(done) {
      var mockRequest = createMockRequest();
      var mockResponse = createMockResponse(null, false, true, 200, done);

      Question.findOne({ include: [db.answer] }).then(function(q) {
        // Zero should never be an id.
        mockRequest.params.id = q.id;
        mockRequest.body.answerId = q.answers[0].id;

        QuestionController.answer(mockRequest, mockResponse);
      });
    });
  });
});

var createMockRequest = function() {
  return {
    cookies: {},
    params: {},
    body: {}
  }
};

var createMockResponse = function(view, hasQuestion, checkStats, status, done) {
  return {
    statusCode: 200,
    cookies: {},

    cookie: function(name, value, options) {
      this.cookies[name] = value;
    },

    render: function(view, data, callback) {
      expect(view).toEqual(view);
      expect(this.statusCode).toBe(status);

      if(hasQuestion) {
        expect(data.question).not.toBeUndefined();
        expect(data.question).not.toBeNull();
        expect(data.question.Model.name).toEqual('question');
        expect(data.question.answers).not.toBeUndefined();
      } else {
        expect(data.question).toBeNull();
      }

      done();
    },

    json: function(data) {
      expect(this.statusCode).toBe(status);

      if(status === 200) {
        expect(this.cookies.alreadySeen).not.toBeUndefined();
      }

      if(hasQuestion) {
        expect(data.question).not.toBeUndefined();
        expect(data.question.Model.name).toEqual('question');
      } else {
        if(status === 200) {
          expect(data.question).toBeNull();
        } else {
          expect(data).toEqual({});
        }
      }
      if(checkStats) {
        // TODO This is fragile and should probably be changed at some point.
        // The only value that should be in alreadySeen is the one from this call.
        Question.findById(
          this.cookies.alreadySeen[0],
          { include: [db.answer] }
        ).then(function(q) {
          expect(q.timesAnswered).toBe(1);
          expect(q.answers[0].timesAnswered).toBe(1);
          done();
        });
      } else {
        done();
      }
    },

    status: function(statusCode) {
      this.statusCode = statusCode;
      return this;
    }
  };
};
