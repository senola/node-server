/**
 * 初始化服務
 */

const config = require('./config'),
    logger = require('./utils/logger');


/**
 * 服務初始化
 */
function init() {
    logger.info('服务器初始化开始...');

    // TODO step1 初始化modals

    logger.info('服务器初始化完成...');
}

module.exports = init;
