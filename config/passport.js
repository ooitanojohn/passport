/**
 * passport認証
 */
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require('passport-google-oidc');
const { Strategy } = require("passport-twitter");
const { loginCheck } = require("./passport/local");
const { googleAuth } = require("./passport/google");
const { twitterAuth } = require("./passport/twitter");
const session = require('express-session');

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
  /**
   * ログインチェック
   */
  /** local */
  passport.use(new LocalStrategy({
    usernameField: "user_login_id",
    passwordField: "password",
  }, function verify(user_login_id, password, cb) {
    loginCheck(user_login_id, password, cb);
  }));
  /** google */
  passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/google',
    scope: ['profile']
  }, function verify(issuer, profile, cb) {
    googleAuth(issuer, profile, cb);
  }));
  /** twitter */
  passport.use(new Strategy({
    consumerKey: process.env['TWITTER_API_KEY'],
    consumerSecret: process.env['TWITTER_API_SECRET'],
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
    function verify(token, tokenSecret, profile, cb) {
      twitterAuth(token, tokenSecret, profile, cb);
    }
  ));
  /** authorization */
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.authenticate('session'));

}