let queryBuilder;

Object.defineProperty(exports, 'knex', {
    enumerable: true,
    configurable: true,
    get: function get() {
        queryBuilder = queryBuilder || require('./query-builder');
        return queryBuilder;
    }
});

