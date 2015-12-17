'use strict'

var db = require('../../models/db.js');

var Admin = db.admin;

describe('Admin', function() {
  it('saves a record correctly', function(done) {
    this.createDefaultAdmin().then(function(a) {
      expect(a.isNewRecord).toBe(false);
      done();
    }).catch(this.createCheckHasNoErrorsCallback(done));
  });

  it('doesn\'t allow null email', function(done) {
    this.checkAdminIsNotValid(null, 'password digest', done);
  });

  it('doesn\'t allow empty email', function(done) {
    this.checkAdminIsNotValid('', 'password digest', done);
  });

  it('doesn\'t allow null passwordDigest', function(done) {
    this.checkAdminIsNotValid('email@example.com', null, done);
  });

  it('doesn\'t allow empty passwordDigest', function(done) {
    this.checkAdminIsNotValid('email@example.com', '', done);
  });

  it('doesn\'t allow invalid emails', function(done) {
    this.checkAdminIsNotValid('emailexample.com', 'password', done);
  });
});
