'use strict';

/**
 * 返回一个区间内的随机的浮点数
 * @param min
 * @param max
 * @returns {*}
 */
module.exports = function (min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
        throw new TypeError('Expected all arguments to be numbers');
    }

    return Math.random() * (max - min) + min;
};