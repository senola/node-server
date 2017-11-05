/**
 * modals
 */
const __ = require('lodash');
const exports = module.exports;

// models array
const models = [
    'users'
];

/**
 * exports all models
 */
function init() {
    models.forEach(name=> {
        __.extend(exports, require('./' + name));
    });
}

exports.init = init;
