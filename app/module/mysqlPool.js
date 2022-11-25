/**
 * MySQL poolを使用 参照と更新処理
 */
const { poolQuery } = require('../../config/module/mysqlPool');

const MySQLTransaction = require('../../config/module/mysqlTransaction');

// 引数にクエリとバインド用valuesを取れるようにして、結果を受け取る
const executeQuery = async (query, values) => {
  const results = await poolQuery(query, values);
  return results;
};
// トランザクションを開始
const beginTran = async () => {
  const tran = new MySQLTransaction();
  await tran.begin();
  return tran;
};

module.exports = {
  executeQuery,
  beginTran,
};

/** 使用側 */

/** 更新処理の場合 */
// app.get("/", async (req, res, next) => {
//   const { beginTran } = require("/app/module/mysqlPool");
//   const tran = await beginTran();
//   try {
//     await tran.query(
//       `UPDATE user_tbl
//       SET card_number=?, card_key=?, user_state=?
//       WHERE user_id=?`,
//       [3540000000000001, 555, 1, 1]
//     );
//     // throw new Error("エラーテスト");
//     await tran.commit();
//     res.end("OK");
//   } catch (err) {
//     await tran.rollback();
//     next(err);
//   }
// });

/** 参照処理の場合 */
// app.get("/", async (req, res, next) => {
// app/module/mysqlTransactionを読み込む
//   const { executeQuery } = require("app/module/mysqlTransaction");
//   try {
//     const data = await executeQuery('SELECT * FROM `user_tbl` WHERE `user_id` = ? AND `card_key` = ?', ['1', 556])
//     console.log(data);
//   res.end("OK");
//   } catch (err) {
//     next(err);
//   }
// });