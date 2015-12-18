'use strict'

var app = require('../../server.js');
var session = require('supertest-session');

var testSession = null;
var question = null;

var createQuestionData = { question: {
  question: 'Do you like pizza?',
  answers: [
    { answer: 'Yes' },
    { answer: 'No' }
  ]
} };

var updateQuestionData = { question: {
  question: 'Do you like pizza?',
  answers: [
    { id: 1, answer: 'Yes' },
    { id: 2, answer: 'No' }
  ]
} };

describe('Admin routes', function() {
  beforeAll(function() {
    testSession = session(app);
  });

  beforeEach(function(done) {
    this.createDefaultQuestionWithAnswers().then(function(q) {
      question = q;
      done();
    });
  });

  describe('when Admin not logged in', function() {
    describe('GET /admin', function() {
      it('returns 200', function(done) {
        testGET(testSession, '/admin', 200, done);
      });
    });

    describe('POST /admin/login', function() {
      it('returns 200', function(done) {
        testPOST(testSession, '/admin/login', 200, null, done);
      });
    });

    describe('GET /admin/questions', function() {
      it('returns 404', function(done) {
        testGET(testSession, '/admin/questions', 404, done);
      });
    });

    describe('GET /admin/questions/new', function() {
      it('returns 404', function(done) {
        testGET(testSession, '/admin/questions/new', 404, done);
      });
    });

    describe('POST /admin/questions', function() {
      it('returns 404', function(done) {
        testPOST(testSession, '/admin/questions', 404, createQuestionData, done);
      });
    });

    describe('GET /admin/questions/:id/edit', function() {
      it('returns 404', function(done) {
        // Id is arbitrary here since we get redirected in middleware.
        testGET(testSession, '/admin/questions/1/edit', 404, done);
      });
    });

    describe('POST /admin/questions/:id/update', function() {
      it('returns 404', function(done) {
        // Id is arbitrary here since we get redirected in middleware.
        testPOST(testSession, '/admin/questions/1/update', 404, updateQuestionData, done);
      });
    });

    describe('POST /admin/questions/:id/delete', function() {
      it('returns 404', function(done) {
        // Id is arbitrary here since we get redirected in middleware.
        testPOST(testSession, '/admin/questions/1/delete', 404, null, done);
      });
    });
  });

  describe('when Admin logged in', function() {
    beforeAll(function(done) {
      login(testSession, done);
    });

    describe('GET /admin', function() {
      it('returns 200', function(done) {
        testGET(testSession, '/admin', 302, done);
      });
    });

    describe('POST /admin/login', function() {
      it('returns 302', function(done) {
        testPOST(testSession, '/admin/login', 302, null, done);
      });
    });

    describe('GET /admin/questions', function() {
      it('returns 200', function(done) {
        testGET(testSession, '/admin/questions', 200, done);
      });
    });

    describe('GET /admin/questions/new', function() {
      it('returns 200', function(done) {
        testGET(testSession, '/admin/questions/new', 200, done);
      });
    });

    describe('POST /admin/questions', function() {
      it('returns 302', function(done) {
        testPOST(testSession, '/admin/questions', 302, createQuestionData, done);
      });
    });

    describe('GET /admin/questions/:id/edit', function() {
      it('returns 200', function(done) {
        // Id is arbitrary here since we get redirected in middleware.
        testGET(testSession, '/admin/questions/' + question.id + '/edit', 200, done);
      });
    });

    describe('POST /admin/questions/:id/update', function() {
      it('returns 302', function(done) {
        // Id is arbitrary here since we get redirected in middleware.
        testPOST(testSession, '/admin/questions/' + question.id + '/update', 302, updateQuestionData, done);
      });
    });

    describe('POST /admin/questions/:id/delete', function() {
      it('returns 302', function(done) {
        // Id is arbitrary here since we get redirected in middleware.
        testPOST(testSession, '/admin/questions/' + question.id + '/delete', 302, null, done);
      });
    });
  });
});

var testGET = function(sess, path, statusCode, done) {
    sess.get(path)
      .expect(statusCode)
      .end(createErrorCheck(done));
};

var testPOST = function(sess, path, statusCode, data, done) {
    sess.post(path)
      .send(data)
      .expect(statusCode)
      .end(createErrorCheck(done));
};

var login = function(sess, done) {
  //createDefaultAdmin().then(function() {
    sess.post('/admin/login')
      .send({ email: "user@example.com", password: "password" })
      .expect(302)
      .end(createErrorCheck(done));
  //});
}

var createErrorCheck = function(done) {
  return function(err, res) {
    if(err) {
      expect(err).toBeUndefined();
    }
    done();
  }
}
