var express = require("express"),
    bodyParser = require("body-parser"), //请求body解析中间件
    morgan = require('morgan'), // HTTP请求日志中间件
    cookieParser = require('cookie-parser'), //cookie解析中间件
    flash = require("connect-flash"), //The flash is a special area of the session used for storing messages
    passport = require("./server/passport/passport"); // passport

var app = express();

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('/login', passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/error',
    session: true,
    failureFlash: false
    // successFlash: 'Welcome!',
    // failureFlash: 'Invalid username or password.'
}));

app.get('/success', function (req, res) {
  res.send('login success!!')
});
app.get('/error', function (req, res) {
  res.send('Invalid username or password.')
})

// 捕获404错误
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
