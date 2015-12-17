'use strict'

var express = require('express');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var QuestionController = require('./controllers/question.js');

var app = express();
var templateDir = path.join(__dirname, 'templates');

app.set('view engine', 'jade');
app.set('views', templateDir);
app.locals.basedir = templateDir;

app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', QuestionController.show);
app.post('/question/:id/answer', QuestionController.answer);

http.createServer(app).listen(process.env.PORT);
