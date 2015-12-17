'use strict'

var AdminController = require('../../controllers/admin.js');
var db = require('../../models/db.js');
var Sequelize = db.Sequelize;
var Promise = Sequelize.Promise;
var Question = db.question;
var Answer = db.answer;
var Admin = db.admin;

describe('AdminController', function() {
  beforeEach(function(done) {
    var self = this;

    Question.destroy({ where: {} }).then(function() {
      return Promise.settle([
        self.createDefaultQuestionWithAnswers(),
        self.createDefaultQuestionWithAnswers()
      ]);
    }).then(done).catch(this.simpleCatch);
  });

  describe('#index', function() {
    it('shows a list of questions', function(done) {
      var mockRequest = createMockRequest();
      var mockResponse = createMockResponse('admin/index', 200, null, function(data) {
        expect(data.questions.length).toBe(2);
      }, done);

      AdminController.index(mockRequest, mockResponse);
    });
  });

  describe('#new', function() {
    it('renders admin/new', function(done) {
      var mockRequest = createMockRequest();
      var mockResponse = createMockResponse('admin/new', 200, null, null, done);

      AdminController.new(mockRequest, mockResponse);
    });
  });

  describe('#create', function() {
    it('creates a questions with answers and redirects to /admin/questions', function(done) {
      // Deleting all other questions and answers to ensure this created both.
      Promise.settle([
        Question.destroy({ where: {} }),
        Answer.destroy({ where: {} })
      ]).then(function() {
        var mockRequest = createMockRequest();
        var mockResponse = createMockResponse(null, 302, '/admin/questions', null, function() {
          Promise.settle([ Question.count(), Answer.count() ]).then(function(countPromises) {
            expect(countPromises[0].value()).toBe(1); // Question count
            expect(countPromises[1].value()).toBe(3); // Answer count
          });
          done();
        });

        mockRequest.body.question = {
          question: 'My name is Ron Burgundy?',
          answers: [ 'Yes', 'No', 'maybe' ]
        };

        AdminController.create(mockRequest, mockResponse);
      });
    });

    it('renders admin/new when invalid question', function(done) {
      var mockRequest = createMockRequest();
      var mockResponse = createMockResponse('admin/new', 200, null, function(data) {
        expect(data.question).not.toBeUndefined();
        expect(data.question.question).not.toBeUndefined();
        expect(data.question.answers).not.toBeUndefined();
        expect(data.question.answers.length).toBe(3);
      }, done);

      mockRequest.body.question = {
        question: '',
        answers: [ 'Yes', 'No', 'maybe' ]
      };

      AdminController.create(mockRequest, mockResponse);
    });

    it('renders admin/new when no answers submitted', function(done) {
      var mockRequest = createMockRequest();
      var mockResponse = createMockResponse('admin/new', 200, null, function(data) {
        expect(data.question).not.toBeUndefined();
        expect(data.question.question).not.toBeUndefined();
        expect(data.question.answers).not.toBeUndefined();
      }, done);

      mockRequest.body.question = {
        question: 'My name is Ron Burgundy?',
        answers: null
      };

      AdminController.create(mockRequest, mockResponse);
    });
  });

  describe('#edit', function() {
    it('renders admin/edit', function(done) {
      Question.findOne().then(function(q) {
        var mockRequest = createMockRequest();
        var mockResponse = createMockResponse('admin/edit', 200, null, function(data) {
          expect(data.question).not.toBeUndefined();
          expect(data.question).not.toBeNull();
          expect(data.question.id).toBe(q.id);
        }, done);

        mockRequest.params.id = q.id;

        AdminController.edit(mockRequest, mockResponse);
      });
    });

    it('renders a 404 when the question is not found', function(done) {
      var mockRequest = createMockRequest();
      var mockResponse = createMockResponse('404', 404, null, null, done);

      mockRequest.params.id = 0;
      AdminController.edit(mockRequest, mockResponse);
    })
  });

  describe('#update', function() {
    it('updates question and answers then redirects to /admin/questions', function(done) {
      Question.findOne().then(function(question) {
        var mockRequest = createMockRequest();
        var mockResponse = createMockResponse(null, 302, '/admin/questions', null, function() {
          Question.findById(question.id, { include: [Answer] }).then(function(question) {
            expect(question.question).toEqual(mockRequest.body.question.question);
            expect(question.answers.length).toBe(3);
            done();
          });
        });

        mockRequest.params.id = question.id;
        mockRequest.body.question = {
          question: "New question?",
          answers: [ 'Some', 'New', 'Answers' ]
        };

        AdminController.update(mockRequest, mockResponse);
      });
    });

    it('renders admin/edit when invalid question', function(done) {
      Question.findOne().then(function(question) {
        var mockRequest = createMockRequest();
        var mockResponse = createMockResponse('admin/edit', 200, null, function(data) {
          expect(data.question).not.toBeUndefined();
          expect(data.question.question).not.toBeUndefined();
          expect(data.question.answers).not.toBeUndefined();
          expect(data.question.answers.length).toBe(3);
        }, done);

        mockRequest.params.id = 0;
        mockRequest.body.question = {
          question: '',
          answers: [ 'Yes', 'No', 'maybe' ]
        };

        AdminController.update(mockRequest, mockResponse);
      });
    });

    it('renders admin/edit when no answers submitted', function(done) {
      Question.findOne().then(function(question) {
        var mockRequest = createMockRequest();
        var mockResponse = createMockResponse('admin/edit', 200, null, function(data) {
          expect(data.question).not.toBeUndefined();
          expect(data.question.question).not.toBeUndefined();
          expect(data.question.answers).not.toBeUndefined();
        }, done);

        mockRequest.params.id = 0;
        mockRequest.body.question = {
          question: 'My name is Ron Burgundy?',
          answers: null
        };

        AdminController.update(mockRequest, mockResponse);
      });
    });

    it('renders a 404 when question doesn\'t exist', function(done) {
      var mockRequest = createMockRequest();
      var mockResponse = createMockResponse('404', 404, null, null, done);

      mockRequest.params.id = 0;
      mockRequest.body.question = {
        question: 'My name is Ron Burgundy?',
        answers: [ 'Yes', 'No', 'maybe' ]
      };

      AdminController.update(mockRequest, mockResponse);
    });
  });

  describe('#delete', function() {
    it('deletes the question and redirects to /admin/questions', function(done) {
      Question.findOne().then(function(q) {
        var mockRequest = createMockRequest();
        var mockResponse = createMockResponse(null, 302, '/admin/questions', null, function() {
          Question.findById(q.id).then(function(deletedQuestion) {
            expect(deletedQuestion).toBeNull();
            done();
          });
        });

        mockRequest.params.id = q.id;
        AdminController.delete(mockRequest, mockResponse);
      });
    });
  });

  describe('#showLogin', function() {
    it('renders the login form', function(done) {
      var mockRequest = createMockRequest();
      var mockResponse = createMockResponse('admin/login', 200, null, null, done);

      AdminController.showLogin(mockRequest, mockResponse);
    });
  });

  describe('#login', function() {
    beforeEach(function(done) {
      this.createDefaultAdmin().then(done);
    });

    it('logs in and redirects with correct credentials', function(done) {
      var mockRequest = createMockRequest();
      var mockResponse = createMockResponse(null, 302, '/admin/questions', null, done);

      mockRequest.body.email = 'user@example.com'
      mockRequest.body.password = 'password'

      AdminController.login(mockRequest, mockResponse);
    });

    it('renders the login form with invalid email', function(done) {
      var mockRequest = createMockRequest();
      var mockResponse = createMockResponse('admin/login', 200, null, function(data) {
        expect(data.admin).not.toBeUndefined();
      }, done);

      mockRequest.body.email = 'wrongemail@example.com'
      mockRequest.body.password = 'password'

      AdminController.login(mockRequest, mockResponse);
    });

    it('renders the login form with wrong password', function(done) {
      var mockRequest = createMockRequest();
      var mockResponse = createMockResponse('admin/login', 200, null, function(data) {
        expect(data.admin).not.toBeUndefined();
      }, done);

      mockRequest.body.email = 'user@example.com'
      mockRequest.body.password = 'wrong password'

      AdminController.login(mockRequest, mockResponse);
    });
  });
});

var createMockRequest = function() {
  return {
    params: {},
    body: {},
    session: {}
  };
}

var createMockResponse = function(expectedView, expectedStatus, redirectUrl, checkData, done) {
  return {
    statusCode: 200,

    status: function(code) {
      this.statusCode = code;
      return this;
    },

    render: function(view, data) {
      expect(view).toEqual(expectedView);
      expect(this.statusCode).toEqual(expectedStatus);
      if(checkData) {
        checkData(data);
      }
      done();
    },

    redirect: function(path) {
      this.status(302);
      expect(this.statusCode).toEqual(expectedStatus);
      expect(path).toEqual(redirectUrl);
      done();
    }
  };
}
