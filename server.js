'use strict'

var express = require('express');
var http = require('http');

var app = express();

app.get('/', function(req, res) {
  res.send('Hello World!');
});

http.createServer(app).listen(3000);
