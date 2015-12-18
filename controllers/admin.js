'use strict'

var db = require('../models/db.js');
var Sequelize = db.Sequelize;
var Promise = Sequelize.Promise;
var Question = db.question;
var Answer = db.answer;
var Admin = db.admin;

var AdminController = {
  index: function(req, res) {
    Question.findAll().then(function(questions) {
      res.render('admin/index', {
        questions: questions
      });
    });
  },

  new: function(req, res) {
    res.render('admin/new');
  },

  create: function(req, res) {
    var question = req.body.question;
    var questionText = getQuestionText(question);
    var answers = getAnswers(question);

    var error = getRequestError(questionText, answers);
    if(error) {
      res.render('admin/new', { error: error, question: question });
      return;
    }

    Question.create({ question: questionText })
      .then(createSaveAnswersForQuestionCallback(answers))
      .then(createRedirectToIndexCallback(res));
  },

  edit: function(req, res) {
    var questionId = req.params.id;

    createFindQuestionByIdCallback(questionId)()
      .then(function(question) {
        if(!question) {
          res.status(404).render('404');
          return;
        }

        res.render('admin/edit', {
          question: question
        });
      });
  },

  update: function(req, res) {
    var self = this;
    var questionId = req.params.id;
    var question = req.body.question;
    var questionText = getQuestionText(question);
    var answers = getAnswers(question);

    var error = getRequestError(questionText, answers);
    if(error) {
      res.render('admin/edit', { error: error, question: question });
      return;
    }

    createFindQuestionByIdCallback(questionId)().then(function(question) {
      if(!question) {
        res.status(404).render('404');
        return;
      }

      return question.update({ question: questionText })
        .then(createSaveAnswersForQuestionCallback(answers))
        .then(createRedirectToIndexCallback(res));
    });
  },

  delete: function(req, res) {
    var questionId = req.params.id;

    Question.destroy({ where: { id: questionId } })
      .then(createRedirectToIndexCallback(res));
  },

  showLogin: function(req, res) {
    res.render('admin/login');
  },

  login: function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    Admin.findOne({ where: { email: email } })
      .then(createAuthenticateAdminCallback(req, res, password))
  }
};

var createFindQuestionByIdCallback = function(questionId) {
  return function() {
    return Question.findById(questionId, { include: [Answer] });
  }
};

var createSaveAnswersForQuestionCallback = function(answers) {
  return function(question) {
    return Promise.settle(createAnswerPromises(answers, question.id));
  };
};

var createRedirectToIndexCallback = function(res) {
  return function() {
    res.redirect('/admin/questions');
  };
};

var createAuthenticateAdminCallback = function(req, res, password) {
  return function(admin) {
    if(admin && admin.comparePassword(password)) {
      req.session.adminId = admin.id;
      res.redirect('/admin/questions');
    } else {
      res.render('admin/login', { admin: admin });
    }
  }
}

// Parses the question out of the data from the request body
var getQuestionText = function(questionRequestBody) {
  if(questionRequestBody && questionRequestBody.question) {
    return questionRequestBody.question;
  }
  return null;
};

// Parses the answers out of the data from the request body
var getAnswers = function(questionRequestBody) {
  if(questionRequestBody && questionRequestBody.answers) {
    return questionRequestBody.answers;
  }
  return [];
}

// TODO check that answers belong to that question. Someone could set the
// id themselves.
// Returns an array of promises to modify answers
var createAnswerPromises = function(answers, questionId) {
  var answerPromises = [];
  var answer = null;
  var promise = null;

  for(var i = 0; i < answers.length; i++) {
    answer = answers[i];
    if(!answer) { continue; }

    if(answer.id) {
      if(answer.answer) {
        // Answer exists and needs to be updated.
        promise = Answer.update({ answer: answer.answer }, {
          where: { id: answer.id }
        });
      } else {
        // Answer exists and needs to be deleted since it's blank
        promise = Answer.destroy({ where: {
          id: answer.id
        } });
      }
    } else {
      // Answer doens't exist and needs to be created
      promise = Answer.create({
        answer: answer.answer,
        questionId: questionId
      });
    }

    answerPromises.push(promise);
  }

  return answerPromises;
}

// Checks if the question and answers from the request are valid.
var getRequestError = function(question, answers) {
  if(!question) {
    return "You need to have a question.";
  }

  if(answers.length) {
    for(var i = 0; i < answers.length; i++) {
      if(answers[i].answer) {
        return null;
      }
    }
    return "You need to have at least one question.";
  } else {
    return "You need to have at least one question.";
  }
};

module.exports = AdminController;
