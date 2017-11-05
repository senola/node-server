/**
 * sqlite3的一些语法封装
 */
const __ = require('lodash'),
    db = require('../../db');

/**
 * 封装knex的任意查询builder
 * @param query
 * @param transaction
 * @param fn
 */
const raw = (query, transaction, fn)=> {
    if (!fn) {
        fn = transaction;
        transaction = null;
    }

    return (transaction || db.knex).raw(query).then(response=> {
        return fn(response);
    });
};

/**
 * 获取tables
 * @param transaction
 */
const getTables = function getTables(transaction) {
    const sql = 'select * from sqlite_master where type = "table"';

    return raw(sql, transaction, response=> {
        return __.reject(__.map(response, 'tbl_name'), name=> {
            return name === 'sqlite_sequence';
        });
    });
};

/**
 * 获取表索引
 * @param table
 * @param transaction
 * @returns {*}
 */
const getIndexes = function getIndexes(table, transaction) {
    return raw('pragma index_list("' + table + '")', transaction, response=> {
        return __.flatten(__.map(response, 'name'));
    });
};

/**
 * 获取列
 * @param table
 * @param transaction
 * @returns {*}
 */
const getColumns = function getColumns(table, transaction) {
    return raw('pragma table_info("' + table + '")', transaction, response=> {
        return __.flatten(__.map(response, 'name'));
    });
};

module.exports = {
    getTables,
    getIndexes,
    getColumns
};
