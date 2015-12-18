'use strict'

beforeEach(function() {
  this.createMockRequest = function() {
    return {
      cookies: {},
      params: {},
      body: {},
      session: {}
    };
  }

  this.createMockResponse = function(expectedView, expectedStatus, redirectUrl, checkData, done) {
    return {
      statusCode: 200,
      cookies: {},

      cookie: function(name, value, options) {
        this.cookies[name] = value;
      },

      status: function(code) {
        this.statusCode = code;
        return this;
      },

      redirect: function(path) {
        this.status(302);
        expect(this.statusCode).toEqual(expectedStatus);
        expect(path).toEqual(redirectUrl);
        done();
      },

      render: function(view, data) {
        expect(view).toEqual(expectedView);
        expect(this.statusCode).toEqual(expectedStatus);
        if(checkData) {
          checkData(data);
        }
        done();
      },

      json: function(data) {
        expect(this.statusCode).toEqual(expectedStatus);
        if(checkData) {
          checkData(data);
        }
        done();
      }
    };
  };
});
