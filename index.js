var path = require('path');
global.appRoot = path.resolve(__dirname);


var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var firebase = require("firebase");

var app = express();
var port_number = process.env.PORT || 3000;
var server = app.listen(port_number, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("API app listening at http://%s:%s", host, port);
  
});


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',express.static(__dirname + '/bower_components'));

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    return next();
});
