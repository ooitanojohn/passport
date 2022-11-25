/**
 * passport認証
 */
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require('express-session');
const { loginCheck } = require("./passport/local");

module.exports = (app) => {
  /** シリアライズ sessionにtokenを保存 */
  passport.serializeUser((user, cb) => {
    process.nextTick(() => {
      console.log(user)
      cb(null, { id: user.id, user_login_id: user.user_login_id });
    });
  });
  /** デシリアライズ sessionからtokenを削除 */
  passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
      return cb(null, user);
    });
  });
  /** ログインチェック */
  passport.use(new LocalStrategy({
    usernameField: "user_login_id",
    passwordField: "password",
  }, function verify(user_login_id, password, cb) {
    loginCheck(user_login_id, password, cb)
  }));
  /** authorization */
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.authenticate('session'));
}