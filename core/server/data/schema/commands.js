const _ = require('lodash');
const Promise = require('bluebird');
const db = require('../db');
const schema = require('./schema');
const clients = require('./clients');

/**
 * @param tableName
 * @param table
 * @param columnName
 */
function addTableColumn(tableName, table, columnName) {
    let column;
    const columnSpec = schema[tableName][columnName]; // 列名

    // creation distinguishes between text with fieldtype, string with maxlength and all others
    if (columnSpec.type === 'text' && columnSpec.hasOwnProperty('fieldtype')) {
        column = table[columnSpec.type](columnName, columnSpec.fieldtype);
    } else if (columnSpec.type === 'string') {
        if (columnSpec.hasOwnProperty('maxlength')) {
            column = table[columnSpec.type](columnName, columnSpec.maxlength);
        } else {
            column = table[columnSpec.type](columnName, 191);
        }
    } else {
        column = table[columnSpec.type](columnName);
    }

    if (columnSpec.hasOwnProperty('nullable') && columnSpec.nullable === true) {
        column.nullable();
    } else {
        column.nullable(false);
    }
    if (columnSpec.hasOwnProperty('primary') && columnSpec.primary === true) {
        column.primary();
    }
    if (columnSpec.hasOwnProperty('unique') && columnSpec.unique) {
        column.unique();
    }
    if (columnSpec.hasOwnProperty('unsigned') && columnSpec.unsigned) {
        column.unsigned();
    }
    if (columnSpec.hasOwnProperty('references')) {
        // check if table exists?
        column.references(columnSpec.references);
    }
    if (columnSpec.hasOwnProperty('defaultTo')) {
        column.defaultTo(columnSpec.defaultTo);
    }
}

/**
 * @param tableName
 * @param column
 * @param transaction
 * @returns {*}
 */
function addColumn(tableName, column, transaction) {
    return (transaction || db.knex).schema.table(tableName, table=> {
        addTableColumn(tableName, table, column);
    });
}

/**
 * 删除列
 * @param table
 * @param column
 * @param transaction
 */
function dropColumn(table, column, transaction) {
    return (transaction || db.knex).schema.table(table, table=> {
        table.dropColumn(column);
    });
}

/**
 * @param table
 * @param column
 * @param transaction
 * @returns {*}
 */
function addUnique(table, column, transaction) {
    return (transaction || db.knex).schema.table(table, table=> {
        table.unique(column);
    });
}

/**
 * @param table
 * @param column
 * @param transaction
 * @returns {*}
 */
function dropUnique(table, column, transaction) {
    return (transaction || db.knex).schema.table(table, table=> {
        table.dropUnique(column);
    });
}


/**
 * https://github.com/tgriesser/knex/issues/1303
 * createTableIfNotExists can throw error if indexes are already in place
 * @param table
 * @param transaction
 */
function createTable(table, transaction) {
    return (transaction || db.knex).schema.hasTable(table).then(exists=> {
        if (exists) {
            return;
        }

        return (transaction || db.knex).schema.createTable(table, t=> {
            const columnKeys = _.keys(schema[table]);

            _.each(columnKeys, column=> {
                return addTableColumn(table, t, column);
            });
        });
    });
}

/**
 * 删除表
 * @param table
 * @param transaction
 * @returns {*}
 */
function deleteTable(table, transaction) {
    return (transaction || db.knex).schema.dropTableIfExists(table);
}

/**
 * @param transaction
 * @returns {*}
 */
function getTables(transaction) {
    const client = (transaction || db.knex).client.config.client;

    if (_.includes(_.keys(clients), client)) {
        return clients[client].getTables(transaction);
    }

    return Promise.reject('notices.data.utils.index.noSupportForDatabase');
}

/**
 *
 * @param table
 * @param transaction
 * @returns {*}
 */
function getIndexes(table, transaction) {
    const client = (transaction || db.knex).client.config.client;

    if (_.includes(_.keys(clients), client)) {
        return clients[client].getIndexes(table, transaction);
    }

    return Promise.reject('notices.data.utils.index.noSupportForDatabase');
}

/**
 * @param table
 * @param transaction
 * @returns {*}
 */
function getColumns(table, transaction) {
    const client = (transaction || db.knex).client.config.client;

    if (_.includes(_.keys(clients), client)) {
        return clients[client].getColumns(table);
    }

    return Promise.reject('notices.data.utils.index.noSupportForDatabase');
}

/**
 *
 * @param transaction
 * @returns {*}
 */
function checkTables(transaction) {
    const client = (transaction || db.knex).client.config.client;
    if (client === 'mysql') {
        // TODO
        // return clients[client].checkPostTable();
    }
}

module.exports = {
    checkTables,
    createTable,
    deleteTable,
    getTables,
    getIndexes,
    addUnique,
    dropUnique,
    addColumn,
    dropColumn,
    getColumns
};
