/**
 * 配置管理中心
 */

const nconf = require('nconf');// node.js分层配置工具
const path = require('path');
const logger = require('../utils/logger');
const env = process.env.NODE_ENV || 'development';
const _private = {};

_private.loadNconf = function loadNconf(options) {
    logger.info('加载系统配置文件...');
    options = options || {};

    const baseConfigPath = options.baseConfigPath || __dirname,
        customConfigPath = options.customConfigPath || process.cwd(); // 不存在则取当前目录

    nconf.file('overrides', path.join(baseConfigPath, 'conf.overrides.json'));

    // Setup nconf to use (in-order):
    //   1. Command-line arguments
    //   2. Environment variables
    //   3. A file located at 'path/to/config.json'
    nconf.argv().env({
        separator: '__'
    });

    // 设置环境env
    nconf.set('env', env);

    const envName = env === 'development' ? 'dev' : 'pro';

    // 加载配置文件
    nconf.file('custom-env', path.join(customConfigPath, 'conf.' + envName + '.json'));
    nconf.file('default-env', path.join(baseConfigPath, 'env', 'conf.' + envName + '.json'));
    nconf.file('defaults', path.join(baseConfigPath, 'conf.defaults.json'));

    logger.data('当前系统配置:\n', nconf.get());
    logger.info('系统配置文件加载完毕...');

    return nconf.get();
};

module.exports = _private.loadNconf();
module.exports.loadNconf = _private.loadNconf;

