'use strict'

var express = require('express');
var http = require('http');
var QuestionController = require('./controllers/question.js');

var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/templates');

app.get('/', QuestionController.show);

http.createServer(app).listen(process.env.PORT);
