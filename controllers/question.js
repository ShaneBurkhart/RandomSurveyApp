'use strict'

var db = require('../../models/db.js');
var Question = db.question;

var QuestionController = {
  // Shows a random survey question that the user has not seen yet.
  show: function(req, res) {
  }
}

module.exports = QuestionController;
