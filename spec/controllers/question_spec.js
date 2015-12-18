'use strict'

var QuestionController = require('../../controllers/question.js');
var db = require('../../models/db.js');
var Question = db.question;
var Answer = db.answer;

describe('QuestionController', function() {
  beforeEach(function(done) {
    var self = this;

    Question.destroy({ where: {} }).then(function() {
      return self.createDefaultQuestionWithAnswers();
    }).then(done).catch(this.simpleCatch);
  });

  describe('#show', function() {
    it('shows a question', function(done) {
      var mockRequest = this.createMockRequest();
      var mockResponse = this.createMockResponse('question/show', 200, null, function(data) {
        expect(data.question).not.toBeUndefined();
        expect(data.question).not.toBeNull();
        expect(data.question.Model.name).toEqual('question');
        expect(data.question.answers).not.toBeUndefined();
      }, done);

      QuestionController.show(mockRequest, mockResponse, this.simpleCatch);
    });

    it('doesn\'t show the same question twice', function(done) {
      var self = this;
      var mockRequest = this.createMockRequest();
      var mockResponse = this.createMockResponse('question/show', 200, null, function(data) {
        expect(data.question).toBeNull();
      }, done);

      // If there is only one question, and we mark it as already seen,
      // there shouldn't be a question in the response.
      Question.findOne().then(function(q) {
        mockRequest.cookies.alreadySeen = [ q.id ];
        QuestionController.show(mockRequest, mockResponse, self.simpleCatch);
      }).catch(this.simpleCatch);
    });
  })

  describe('#answer', function() {
    it('responds with a 404 when the questionId isn\'t found', function(done) {
      var mockRequest = this.createMockRequest();
      var mockResponse = this.createMockResponse(null, 404, null, null, done);
      // Zero should never be an id.
      mockRequest.params.id = 0;

      QuestionController.answer(mockRequest, mockResponse, this.simpleCatch);
    });

    it('responds with a 404 when the answerId doesn\'t belong to the question', function(done) {
      var self = this;
      var mockRequest = this.createMockRequest();
      var mockResponse = this.createMockResponse(null, 404, null, null, done);

      Question.findOne().then(function(q) {
        mockRequest.params.id = q.id;
        // Zero should never be an id.
        mockRequest.body.answerId = 0;
        QuestionController.answer(mockRequest, mockResponse, self.simpleCatch);
      }).catch(this.simpleCatch);
    });

    it('returns a question on success', function(done) {
      var self = this;
      var mockRequest = this.createMockRequest();
      var mockResponse = this.createMockResponse(null, 200, null, function(data) {
        expect(data.question).not.toBeUndefined();
        expect(data.question).not.toBeNull();
        expect(data.question.Model.name).toEqual('question');
        expect(data.question.answers).not.toBeUndefined();
      }, done);

      // BeforeEach creates only one question.  For this test, we want two so that
      // one is returned.  We'll use the question we just created to make the request.
      this.createDefaultQuestionWithAnswers().then(function(q) {
        mockRequest.params.id = q.id;
        mockRequest.body.answerId = q.answers[0].id;
        QuestionController.answer(mockRequest, mockResponse, self.simpleCatch);
      }).catch(this.simpleCatch);
    });

    it('returns an empty object when there aren\'t anymore questions', function(done) {
      var self = this;
      var mockRequest = this.createMockRequest();
      var mockResponse = this.createMockResponse(null, 200, null, function(data) {
        expect(data.question).toBeNull();
      }, done);

      // There is only one question in the db from the beforeEach.
      Question.findOne({ include: [ Answer ] }).then(function(q) {
        mockRequest.params.id = q.id;
        mockRequest.body.answerId = q.answers[0].id;

        QuestionController.answer(mockRequest, mockResponse, self.simpleCatch);
      }).catch(this.simpleCatch);
    });

    it('increments stats for timesAnswered and timesAsked', function(done) {
      var self = this;
      var mockRequest = this.createMockRequest();

      Question.findOne({ include: [ Answer ] }).then(function(q) {
        var mockResponse = self.createMockResponse(null, 200, null, null, function() {
          Question.findById(q.id, { include: [ Answer ] }).then(function(question) {
            expect(question.timesAnswered).toBe(1);
            expect(question.answers[0].timesAnswered).toBe(1);
            done();
          }).catch(self.simpleCatch);
        });

        // Zero should never be an id.
        mockRequest.params.id = q.id;
        mockRequest.body.answerId = q.answers[0].id;

        QuestionController.answer(mockRequest, mockResponse, self.simpleCatch);
      }).catch(this.simpleCatch);
    });
  });
});
