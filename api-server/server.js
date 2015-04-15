var express = require('express');
var app = express();
var upcoming = require('./upcoming');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

app.use('/fanart', express.static('fanart'));

app.get('/user/upcoming', function(req, res) {
    res.json(upcoming(15));
});

var server = app.listen(8080, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('API server listening at http://%s:%s', host, port);

});
