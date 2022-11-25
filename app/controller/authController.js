/**
 * 登録処理
 */
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { beginTran } = require("../module/mysqlPool");

/** userData登録 */
const signup = (req, res, next) => {
  /** パスワードのハッシュ化と登録 */
  bcrypt.hash(req.body.password, saltRounds, async (err, hashedPassword) => {
    if (err) { return next(err); }
    const tran = await beginTran();
    try {
      await tran.query(
        `INSERT INTO users (
          user_login_id,
          hashed_password,
          user_name,
          user_mail,
          user_post_code,
          user_address,
          user_phone_number,
          card_number,
          card_key,
          icon_img,
          user_state
          ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        req.body.user_login_id,
        hashedPassword,
        '', '', '', '', '', '', '', '',
        0,
      ]);
      await tran.commit();
      /** 成功したらsessionにid付与してログイン */
      var user = {
        id: this.lastID,
        user_login_id: req.body.user_login_id
      };
      req.login(user, function (err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    } catch (err) {
      await tran.rollback();
      next(err);
    }
  });
};

module.exports = { signup };
