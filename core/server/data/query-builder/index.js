/**
 * sql查询构建起
 */
const knex = require('knex'), // A flexibleportable query builder for PostgreSQL, MySQL and SQLite3
    config = require('../../../../config.default'),
    dbConfig = config.database;
