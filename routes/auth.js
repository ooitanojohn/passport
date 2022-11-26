var express = require('express');
var passport = require('passport');
const { signup } = require("../app/controller/authController");

var router = express.Router();

/** ログイン画面表示 */
router.get('/login', (req, res, next) => {
  res.render('login');
});
/**
 * local
 */
/** ログインチェック */
router.post('/login/password', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureMessage: true
}));
/**
 * google
 */
/** ボタン押した時 */
router.get('/login/federated/google', passport.authenticate('google'));
/** google認証後リダイレクト */
router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

/** ログアウト*/
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
/** 登録画面表示 */
router.get('/signup', (req, res, next) => {
  res.render('signup');
});
/** 登録処理 */
router.post('/signup', (req, res, next) => {
  signup(req, res, next);
});

module.exports = router;
