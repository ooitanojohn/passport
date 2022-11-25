const { executeQuery } = require("../../app/module/mysqlPool");
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * ログインチェック
 * @param {string} user_login_id ログインID
 * @param {string} password パスワード
 * @param {function} cb passportのコールバック関数
 * @returns msgとかリダイレクト先
 */
const loginCheck = async (user_login_id, password, cb) => {
  try {
    /** userIdを検索 */
    const row = await executeQuery('SELECT user_id,hashed_password FROM users WHERE user_login_id = ?', [user_login_id])
    /** ユーザーIDが見つからなかった時 */
    if (!row) { return cb(null, false, { message: 'ログインID又はパスワードが違います。' }); }
    /** passwordが違うとき */
    bcrypt.compare(password, row[0].hashed_password, (err) => {
      if (err) return cb(null, false, { message: 'ログインID又はパスワードが違います。' });
      var user = {
        id: row[0].user_id,
        user_login_id: user_login_id
      };
      return cb(null, user);
    });
  } catch (err) {
    return cb(err)
  }
};

module.exports = { loginCheck }