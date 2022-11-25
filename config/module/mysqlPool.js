/**
 * コネクションプーリングでMySQL接続
 */
const debugMySQL = require('debug')('MySQL:connect');
const { promisify } = require('util');
const mysql = require('mysql2');
/** 接続設定 */
const { mysqlPoolConf } = require('../conf/mysql');

/** Poolインスタンス */
const pool = mysql.createPool(mysqlPoolConf);
debugMySQL(pool);
// pool.getConnectionプロミス化
const getConnection = promisify(pool.getConnection).bind(pool);
// pool.queryをプロミス化、prepared
const poolQuery = promisify(pool.query).bind(pool);

// 引数にクエリとバインド用valuesを取れるようにして、結果を受け取る
const executeQuery = async (query, values) => {
  const results = await poolQuery(query, values);
  return results;
};
module.exports = {
  poolQuery,
  getConnection,
  executeQuery,
};

/**
 * 実行側
 */
/**  */
// app.get("/", async (req, res, next) => {
//   const { beginTran } = require("../app/module/mysqlTransaction");
//   const tran = await beginTran();
//   try {
//     await tran.query(
//       `UPDATE user_tbl
//       SET card_number=?, card_key=?, user_state=?
//       WHERE user_id=?`,
//       [3540000000000001, 553, 1, 1]
//     );
//     // throw new Error("エラーテスト");
//     await tran.commit();
//     res.end("OK");
//   } catch (err) {
//     await tran.rollback();
//     next(err);
//   }
// });

// app.get("/", async (req, res, next) => {
//   const { executeQuery } = require("./module/mysqlPool");
//   try {
/** 実行動画 */
//     const data = await executeQuery('SELECT * FROM `user_tbl` WHERE `user_id` = ? AND `card_key` = ?', ['1', 556])
//     console.log(data);
//   res.end("OK");
//   } catch (err) {
//     next(err);
//   }
//   //pool.queryを使っているので、開放は不要
// });