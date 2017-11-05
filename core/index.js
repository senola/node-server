/**
 * 服务启动器
 */

const server = require('./server');

// 设置默认的环境变量
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const serverBootstrap = function(options) {
    options = options || {};

    return server(options);
};

module.exports = serverBootstrap;
