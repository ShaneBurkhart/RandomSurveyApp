'use strict'

var db = require('../models/db.js');
var Sequelize = db.Sequelize;
var Promise = Sequelize.Promise;
var Question = db.question;
var Answer = db.answer;
var Admin = db.admin;

var AdminController = {
  index: function(req, res) {
    // Show all questions and have a link to a page that can create pages.
    Question.findAll().then(function(questions) {
      res.render('admin/index', {
        questions: questions
      });
    });
  },

  new: function(req, res) {
    // Show form to create questions with answers.
    res.render('admin/new');
  },

  create: function(req, res) {
    // POST for new.  Creates both questions and answers.
    var question = req.body.question;
    var questionText = getQuestionText(question);
    var answers = getAnswers(question);

    if(!question || !questionText || !answers.length) {
      res.render('admin/new', {
        question: question
      });
      return;
    }

    Question.create({ question: questionText }).then(function(question) {
      return Promise.settle(createAnswerPromises(answers, question.id));
    }).then(function() {
      res.redirect('/admin/questions');
    }).catch(this.simpleCatch);
  },

  edit: function(req, res) {
    // Show edit of question.  On that page, there will be answer editing.
    var questionId = req.params.id;

    Question.findById(questionId, { include: [db.answer] }).then(function(question) {
      if(question) {
        res.render('admin/edit', {
          question: question
        });
      } else {
        res.status(404).render('404');
      }
    })
  },

  update: function(req, res) {
    // POST update for edit.  Updates both questions and answers.
  },

  delete: function(req, res) {
    var questionId = req.params.id;

    Question.destroy({ where: { id: questionId } }).then(function(rowsAffected) {
      res.redirect('/admin/questions');
    });
  },

  showLogin: function(req, res) {
    res.render('admin/login');
  },

  login: function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    Admin.findOne({ where: { email: email } }).then(function(a) {
      if(a && a.comparePassword(password)) {
        res.redirect('/admin/questions');
      } else {
        res.render('admin/login', { admin: a });
      }
    });
  }
};

var getQuestionText = function(questionRequestBody) {
  if(questionRequestBody && questionRequestBody.question) {
    return questionRequestBody.question;
  }
  return false;
};

var getAnswers = function(questionRequestBody) {
  var answers = [];
  var answer = null;

  if(questionRequestBody && questionRequestBody.answers) {
    var requestAnswers = questionRequestBody.answers;
    for(var i = 0; i < requestAnswers.length; i++) {
      answer = requestAnswers[i];
      if(answer) {
        answers.push(answer);
      }
    }
  }
  return answers;
}

var createAnswerPromises = function(answers, questionId) {
  var answerPromises = [];
  var answer = null;

  for(var i = 0; i < answers.length; i++) {
    answer = answers[i];

    answerPromises.push(Answer.create({
      answer: answer,
      questionId: questionId
    }));
  }
  return answerPromises;
}

module.exports = AdminController;
