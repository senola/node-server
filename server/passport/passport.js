/**
 *  passport
 */

var passport = require("passport");
    localStrategy = require('passport-local').Strategy,
    flash = require("connect-flash");

/**
 *  策略配置
 */
passport.use(new localStrategy(
  function(username, password, done) {
    // User.findOne({ username: username }, function(err, user) {
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });
    var user = {
        id: "1",
        username: "aaa",
        password: "12345"
    };
    if(user['username'] == username && user['password'] == password) {
        return done(null, user);
    } else {
        return done(null, false, { message: 'Incorrect username.' });
    }
  }
));

/**
 * session 序列化和反序列化
 */
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    var user = {
        id: "1",
        username: "aaa",
        password: "12345"
    };
    done(null, user);
});

module.exports = passport;
