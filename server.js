var express = require('express');
var wagner = require('wagner-core');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

require('./model/models')(wagner);

var app = express();
app.use('/', require('./routes/video.route')(wagner));


app.use(express.static('www'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());


app.listen(8080);
module.exports = app;

console.log("server running in port 8080");
