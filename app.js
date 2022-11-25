const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

var app = express();

/** authorization */
require("./config/passport")(app)

/** view engine set up */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/** middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** flashMsg */
app.use((req, res, next) => {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !!msgs.length;
  req.session.messages = [];
  next();
});

/** router */
app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth'));


/** error */
/** http-error 404ページ */
app.use(function (req, res, next) {
  /** 404を受け取るとエラーをthrowする */
  next(createError(404));
});

// error handler 404か500のエラーがthrowされたとき、catchする
app.use((err, req, res, next) => {
  /** local変数への格納 */
  res.locals.message = err.message;
  /** error内容 */
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  /** 404か 500を返す */
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
