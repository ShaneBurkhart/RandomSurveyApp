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

  //describe('#new', function() {

  //});
  //describe('#create');
  //describe('#edit');
  //describe('#update');
  //describe('#delete');

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
      var mockResponse = createMockResponse(null, 200, '/admin/questions', null, done);

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
    body: {},
    session: {}
  };
}

var createMockResponse = function(expectedView, expectedStatus, redirectUrl, checkData, done) {
  return {
    statusCode: 200,

    status: function(code) {
      this.statusCode = code;
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
      expect(path).toEqual(redirectUrl);
      done();
    }
  };
}
