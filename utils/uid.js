const getRandomInt = require('./random-int');

/**
 * 返回指定长度的唯一字符串
 * @param len
 * @returns {string}
 */

module.exports = function(len) {
    const buf = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charLen = chars.length;

    for (let i = 0; i < len; i++) {
        buf.push(chars[getRandomInt(0, charLen - 1)]);
    }

    return buf.join('');
};
