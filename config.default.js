/**
 *  系统默认配置
 */
const path = require('path');

const config = {
    // ### Production
    // 线上配置
    production: {
        url: 'http://127.0.0.1:6661', // true: 开启本地调试
        name: 'node-server',
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/data/data.db')
            },
            debug: false
        },
        server: {
            host: '127.0.0.1', // 域名
            port: 6661 // 程序运行端口
        },
        errorLogDir: path.resolve('./logs'), // 日志目录
        cookieSecrect: 'WaStTHbsU&s' // cookie 签名字符串
    },

    // ### Development (默认为该配置)
    development: {
        url: 'http://127.0.0.1:6661', // true: 开启本地调试
        name: 'node-server',
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/data/data-dev.db')
            },
            debug: false
        },
        server: {
            host: '127.0.0.1', // 域名
            port: 6661 // 程序运行端口
        },
        errorLogDir: path.resolve('./logs'), // 日志目录
        cookieSecrect: 'WaStTHbsU&s' // cookie 签名字符串
    }
};

module.exports = config;
