"use strict";
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
 

var routes = require('./routes/index');
var orders = require('./routes/orders');
var explore = require('./routes/explore');
var exports = require('./routes/export');
var booking = require('./routes/booking');
var raw = require('./routes/raw');
var distances = require('./routes/distances');
var positions = require('./routes/positions');
var pathes = require('./routes/path');
var spotbeam = require('./routes/spotbeam');

var app = express();
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/orders', orders);
app.use('/explore', explore);
app.use('/export', exports);
app.use('/booking', booking);
app.use('/raw', raw);
app.use('/distances', distances);
app.use('/positions', positions);
app.use('/path', pathes);
app.use('/spotbeam', spotbeam);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
