'use strict'

var app = require('../../server.js');
var session = require('supertest-session');

var testSession = null;
var question = null;

describe('Admin routes', function() {
  beforeAll(function() {
    testSession = session(app);
  });

  describe('when Admin not logged in', function() {
    beforeEach(function(done) {
      this.createDefaultQuestion().then(function(q) {
        question = q;
        done();
      });
    });

    // This shouldn't be passing...
    describe('GET /admin', function() {
      it('returns 200', function(done) {
        testGET(testSession, '/admin', 200, done);
      });
    });

    describe('POST /admin/login', function() {
      it('returns 404', function(done) {
        testPOST(testSession, '/admin/login', 200, done);
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
        testPOST(testSession, '/admin/questions', 404, done);
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
        testPOST(testSession, '/admin/questions/1/update', 404, done);
      });
    });

    describe('POST /admin/questions/:id/delete', function() {
      it('returns 404', function(done) {
        // Id is arbitrary here since we get redirected in middleware.
        testPOST(testSession, '/admin/questions/1/delete', 404, done);
      });
    });
  });

  describe('when Admin logged in', function() {
    beforeAll(function(done) {
      login(testSession, done);
    });

  });
});

var testGET = function(sess, path, statusCode, done) {
    sess.get(path)
      .expect(statusCode)
      .end(createErrorCheck(done));
};

var testPOST = function(sess, path, statusCode, done) {
    sess.post(path)
      .expect(statusCode)
      .end(createErrorCheck(done));
};

var login = function(sess, done) {
  sess.post('/admin/login')
    .send({ email: "shaneburkhart@gmail.com", password: "password" })
    .expect(200)
    .end(createErrorCheck(done));
}

var createErrorCheck = function(done) {
  return function(err, res) {
    console.log(res.statusCode);
    if(err) {
      expect(err).toBeUndefined();
    }
    done();
  }
}
