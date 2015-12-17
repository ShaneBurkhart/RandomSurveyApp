'use strict'

var db = require('../models/db.js');
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

module.exports = AdminController;
