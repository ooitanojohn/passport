/**
 * transactionで SQL処理
 */
const { getConnection } = require('./mysqlPool');

const MySQLTransaction = class {
  constructor(connection) {
    this.connection = connection;
  }

  async begin() {
    // コネクションの有無確認
    if (this.connection) {
      // コネクションがあれば開放
      this.connection.release();
    }
    // コネクションがなければ、poolからコネクションを取得
    this.connection = await getConnection();

    // トランザクション開始
    this.connection.beginTransaction();
  }

  // クエリの実行 options = {}はfields
  async query(query, values, options = {}) {
    // eslint-disable-next-line no-param-reassign
    options = {
      fields: options.fields || false,
    };
    // プロミスでラップ
    return new Promise((resolve, reject) => {
      // クエリを実行
      this.connection.query(query, values, (err, results, fields) => {
        if (!err) {
          // fieldsがあれば、fieldsの情報も含めて返却
          resolve(!options.fields ? results : { results, fields });
        } else {
          reject(err);
        }
      });
    });
  }

  async commit() {
    return new Promise((resolve, reject) => {
      // コミットを実行
      this.connection.commit((err) => {
        if (!err) {
          // エラーでなければコネクションを開放
          this.connection.release();
          this.connection = null;
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  async rollback() {
    return new Promise((resolve) => {
      // ロールバックを実行
      this.connection.rollback(() => {
        // コネクションを開放
        this.connection.release();
        this.connection = null;
        resolve();
      });
    });
  }
};

module.exports = MySQLTransaction;