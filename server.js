'use strict'

var express = require('express');
var cookieParser = require('cookie-parser')
var http = require('http');
var path = require('path');
var QuestionController = require('./controllers/question.js');

var app = express();
var templateDir = path.join(__dirname, 'templates');

app.set('view engine', 'jade');
app.set('views', templateDir);
app.locals.basedir = templateDir;

app.use(cookieParser());

app.get('/', QuestionController.show);

http.createServer(app).listen(process.env.PORT);
