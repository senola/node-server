/**
 * sql查询构建起
 */
const knex = require('knex'), // A flexible portable query builder for PostgreSQL, MySQL and SQLite3
    config = require('../../config'),
    logger = require('../../utils/logger');
let queryBuilder;

/**
 * 初始化query builder实例
 */
function initConfig(dbConfig) {
    const client = dbConfig.client;

    if (client === 'sqlite3') {
        dbConfig.useNullAsDefault = dbConfig.useNullAsDefault || false;
    } else {
        // TODO other db like mysql, pg...
        logger.error('暂时只支持sqlite3!');
    }

    return dbConfig;
}

if (!queryBuilder && config.get('database') && config.get('database').client) {
    // 初始化查询器
    queryBuilder = knex(initConfig(config.get('database')));
}

module.exports = queryBuilder;
