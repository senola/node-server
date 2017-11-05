let queryBuilder;

Object.defineProperties(exports, 'knex', {
    enumerable: true,
    configurable: true,
    get: function get() {
        queryBuilder = queryBuilder || require('./queryBuilder');
        return queryBuilder;
    }
});

