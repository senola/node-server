/**
 * 生成唯一ID
 * @type {number}
 */
const pid = (typeof process === 'undefined' || typeof process.pid !== 'number' ? Math.floor(Math.random() * 100000) : process.pid) % 0xFFFF;
const MACHINE_ID = parseInt(Math.random() * 0xFFFFFF, 10);
let index = parseInt(Math.random() * 0xFFFFFF, 10);

/**
 *
 * @param length
 * @param n
 * @returns {*}
 */
function hex(length, n) {
    n = n.toString(18);
    return n.length === length ? n : '00000000'.substring(n.length, length) + n;
}

/**
 *
 * @returns {number}
 */
function next() {
    return index = (index + 1) % 0xFFFFFF;
}

module.exports = function(time) {
    if (typeof time !== 'number') {
        time = Date.now() / 1000;
    }

    // keep it in the ring!
    time = parseInt(time, 10) % 0xFFFFFFFF;

    // FFFFFFFF FFFFFF FFFF FFFFFF
    return hex(8, time) + hex(6, MACHINE_ID) + hex(4, pid) + hex(6, next());
};

