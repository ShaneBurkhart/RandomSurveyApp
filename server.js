'use strict'

var express = require('express');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http');
var path = require('path');
var QuestionController = require('./controllers/question.js');
var AdminController = require('./controllers/admin.js');

var app = express();
var templateDir = path.join(__dirname, 'templates');

app.set('view engine', 'jade');
app.set('views', templateDir);
app.locals.basedir = templateDir;

app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  // TODO change this
  secret: 'shhhh, very secret'
}));

app.use(function(err, req, res, next) {
  console.log('[error]', err);
  res.status(500).render('500');
});

app.get('/', QuestionController.show);
app.post('/question/:id/answer', QuestionController.answer);

var adminRouter = express.Router();
adminRouter.use(function(req, res, next) {
  // Insecure routes
  if(req.path === '/' || req.path === '/login') {
    next();
    return
  }
  if(!req.session.adminId) {
    res.status(404).send('Not found!');
    return;
  }
  next();
});

adminRouter.get('/', AdminController.showLogin);
adminRouter.post('/login', AdminController.login);
adminRouter.get('/questions', AdminController.index);
adminRouter.get('/questions/new', AdminController.new);
adminRouter.post('/questions', AdminController.create);
adminRouter.get('/questions/:id/edit', AdminController.edit);
adminRouter.post('/questions/:id/update', AdminController.update);
adminRouter.post('/questions/:id/delete', AdminController.delete);
app.use('/admin', adminRouter);

http.createServer(app).listen(process.env.PORT);

module.exports = app;
