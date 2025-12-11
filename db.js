/*
  Title: db.js
  Author: Luis Simiao
  Purpose: hold local MySQL connection configuration for Node scripts (NODE_DB_CONFIG). DO NOT commit production credentials.
*/

const NODE_DB_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'encryption_db',
};

module.exports = {
  NODE_DB_CONFIG,
};
