/**
 *  日志工具
 *  1、config/config.default.js 配置日志的存储目录
 *  2、日志以天命名，如：2017-10-30.log， 2017-10-31.log,默认只收集error级别错误
 *  3、支持7中level： error/debug/warn/data/info/verbose/silly
 *  4、示例：
 *    logger.error("服务器异常");
 *    logger.debug("服务器异常", {number: 123});
 *    logger.debug("服务器异常", {number: 123});
 *    logger.warn("服务器异常, 服务器名称: %s, id: %d", "127.0.0.1", "1254", {number: 123});
 */

const path = require('path');
const moment = require('moment');
const __ = require('lodash');
const {createLogger, format, transports} = require('winston'); // A logger for just about everything
const {combine, printf} = format;
const logDir = 'content/logs';
/**
 *  默认配置（级别对应的颜色）
 */
const winstonConfig = {
    levels: {
        error: 0, // error
        debug: 1, // debug
        warn: 2, // warn
        data: 3, // data
        info: 4, // info
        verbose: 5, // verbose
        silly: 6 // silly
    },
    colors: {
        error: 'red',
        debug: 'blue',
        warn: 'yellow',
        data: 'grey',
        info: 'green',
        verbose: 'cyan',
        silly: 'magenta'
    },
    // 格式化输出内容，如：
    //      时间             level           content
    // [2017-10-30 19:25:51] [error]: This is an information message.
    logFormat: printf(info=> {
        let message = info[Object.getOwnPropertySymbols(info)[1]]; // 此处用点坑，只能用getOwnPropertySymbols() API获取symbols

        if (message !== undefined && __.endsWith(message, '{}')) {
            message = message.substring(0, message.length - 2);
        }
        return `[${moment(info.timestamp).format('YYYY-MM-DD HH:mm:ss')}] ${message} ${info.label === undefined ? '' : info.label}`;
    }),
    errorFileName: path.join(logDir + '/' + moment().format('YYYY-MM-DD') + '.log') // 日志文件绝对路径
};

/**
 * 创建logger实例
 */
const logger = createLogger({
    levels: winstonConfig.levels,
    format: combine(
        format.colorize({all: true}), // all: ture 内容的颜色也变换
        format.json(),
        format.splat(),
        format.simple(),
        winstonConfig.logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            level: 'error',
            filename: winstonConfig.errorFileName,
            colorize: false
        }),
        new transports.File({
            level: 'warn',
            filename: winstonConfig.errorFileName,
            colorize: false
        })
    ]
});

module.exports = logger;
