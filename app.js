var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var index = require('./routes/index');
var forecast = require('./routes/forecast');

var app = express();



/**
 * Failover (Checking for DarkSky.net API Key)
 * 
 * This is designed to warn the interactive developer of a missing API key if 
 * s/he has not set up the corresponding environment variable. This would
 * usually be canvassed in the README but seeing as we're on a tight timeline...
 */

if (process.env.DARKSKY_API_KEY === undefined) {
  console.error('\x1b[31m%s\x1b[0m', "Missing DARKSKY_API_KEY environment variable. Exiting.");
  process.exit();
} else {
  console.log('\x1b[32m%s\x1b[0m', "Environment variable DARKSKY_API_KEY found.. Starting server.")
}

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
app.use(cors());
app.use('/', index);
app.use('/forecast', forecast);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
