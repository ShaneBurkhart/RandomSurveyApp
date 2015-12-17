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

  it('doesn\'t allow duplicate emails', function(done) {
    var self = this;
    // Make sure user@example.com is created
    this.createDefaultAdmin().then(function() {
      self.checkAdminIsNotValid('user@example.com', 'password', done);
    });
  });

  describe('#setPassword', function() {
    it('sets the passwordDigest', function() {
      var admin = Admin.build({ email: 'user@exmple.com' });
      expect(admin.passwordDigest).toBeUndefined();
      admin.setPassword('some password');
      expect(admin.passwordDigest).not.toBeUndefined();
    });
  });

  describe('#comparePassword', function() {
    var admin = null;

    beforeEach(function(done) {
      this.createDefaultAdmin().then(function(a) {
        admin = a;
        done();
      });
    });

    it('returns true with correct password', function() {
      expect(admin.comparePassword('password')).toBe(true);
    });

    it('returns false with incorrect password', function() {
      expect(admin.comparePassword('wrong password')).toBe(false);
    });
  });
});
