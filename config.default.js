/**
 *  系统默认配置
 */
const path = require('path');

const config = {
    debug: true, // true: 开启本地调试
    name: 'node-server',
    description: 'node server project', //
    keywords: 'nodejs, node, express, connect, socket.io', //关键字

    error_log_dir: path.resolve('./logs'), // 日志目录
    host: '127.0.0.1', // 域名
    port: 8999 // 程序运行端口
};
module.exports = config;