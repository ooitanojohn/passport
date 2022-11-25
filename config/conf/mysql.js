// mysql connect
require('dotenv').config();

const mysqlConf = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
const mysqlPoolConf = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 20, // デフォルトは10
  queueLimit: 0,
};

exports.mysqlConf = mysqlConf;
exports.mysqlPoolConf = mysqlPoolConf;
