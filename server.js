var express = require("express");
var path = require('path');
var index = require('./server/routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'servers/views'));
app.set('view engine', 'jade');

app.use('/', index);

// 捕获且往下传递404错误
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 错误处理
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
