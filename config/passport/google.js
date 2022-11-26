const { beginTran } = require("../../app/module/mysqlPool");

/**
 * googleログイン
 * @param {string} issuer issuer authサービス先のURL
 * @param {object} profile profile.id 不明 + 名前が帰ってくる
 * @param {function} cb
 */
const googleAuth = async (issuer, profile, cb) => {
  try {
    /** 初ログイン */
    const tran = await beginTran();
    /** 既にgoogleログインしているか credentialに引っかかるか否か */
    const row = await tran.query('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [issuer,
      profile.id]).catch((err) => { return cb(err) });

    if (row.length === 0) {
      let id = '';
      /** userTableにlogin_idを追加 */
      await tran.query('INSERT INTO users (user_login_id) VALUES (?)', [profile.displayName]) /** 追加した最後のIDを取ってくる (userID) */
        .then((results) => { id = results.insertId })
        .catch((err) => { throw err; });

      /** クレデンシャル tableに登録 */
      await tran.query('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [id, issuer, profile.id])
        .catch((err) => { throw err; });
      await tran.commit();
      var user = {
        id: id,
        user_login_id: profile.displayName
      };
      return cb(null, user);
    } else {
      /** 既ログイン */
      const row2 = await tran.query('SELECT * FROM users WHERE user_id = ?', [row[0].user_id])
        .catch((err) => { return cb(err) });
      if (row2.length === 0) { return cb(null, false); }
      return cb(null, row2[0]);
    }
  } catch (err) {
    await tran.rollback();
    return cb(err)
  }
}

module.exports = { googleAuth }