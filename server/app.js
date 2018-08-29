var express = require('express');
var app = express();
var routes  = require('./routes/user');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var connectionString = 'mongodb://localhost:27017/jwt-test';

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use(routes);

mongoose.connect(connectionString, {useNewUrlParser: true});

app.listen(5000, ()=>{console.log('Example app listening on port 5000')});

module.exports = app;