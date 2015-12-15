'use strict'

var db = require('../../../models/db.js');
var Answer = db.answer;

beforeEach(function() {
  this.createAnswer = function(a, qId) {
    return Answer.create({
      answer: a,
      questionId: qId
    });
  };
});
