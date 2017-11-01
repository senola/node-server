'use strict';

/**
 * 返回一个区间随机的整数,如[0,1] 可能返回值为0，或者1
 * @param min
 * @param max
 * @returns {number}
 */
module.exports = function(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
        throw new TypeError('Expected all arguments to be numbers');
    }

    return Math.floor(Math.random() * (max - min + 1) + min);
};
