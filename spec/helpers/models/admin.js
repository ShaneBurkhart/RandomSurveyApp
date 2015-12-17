'use strict'

var db = require('../../../models/db.js');
var Promise = db.Sequelize.Promise;
var Admin = db.admin;

beforeEach(function() {
  this.checkAdminIsNotValid = function(email, passwordDigest, done) {
      Admin.create({
        email: email,
        passwordDigest: passwordDigest
      }).then(function(a) {
        expect(a).toBeUndefined();
        done();
      }).catch(this.createCheckHasErrorsCallback(done));
  };

  this.createDefaultAdmin = function() {
    return this.createAdmin("user@example.com", "password");
  };

  this.createAdmin = function(email, password) {
    var admin = Admin.build({
      email: email
    });

    admin.setPassword(password);
    return admin.save();
  };
});
