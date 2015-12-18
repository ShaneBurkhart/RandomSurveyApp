'use strict'

beforeEach(function() {
  this.createCheckHasNoErrorsCallback = function(done) {
    return function(err) {
        expect(err).toBeUndefined();
        done();
    }
  };

  this.createCheckHasErrorsCallback = function(done) {
    return function(err) {
        expect(err).not.toBeUndefined();
        done();
    }
  };
});
