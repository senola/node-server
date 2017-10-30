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
const config = require('../config/config.default'); // 配置
const { createLogger, format, transports } = require('winston'); // A logger for just about everything
const { combine, timestamp, label, printf, prettyPrint } = format;
/**
 *  默认配置（级别对应的颜色）
 */
const winston_config = {
    levels: {
        error:     0,  // error
        debug:     1,  // debug
        warn:      2,  // warn
        data:      3,  // data
        info:      4,  // info
        verbose:   5,  // verbose
        silly:     6   // silly
    },
    colors: {
        debug:    'blue',
        warn:     'yellow',
        data:     'grey',
        info:     'green',
        verbose:  'cyan',
        silly:    'magenta'
    },
    log_format: printf(info => {
        // 格式化输出内容，如：
        //       时间             level           content
        // [2017-10-30 19:25:51] [error]: This is an information message.
        const message = info[Object.getOwnPropertySymbols(info)[1]]; //此处用点坑，只能用getOwnPropertySymbols() API获取symbols
        return `[${moment(info.timestamp).format('YYYY-MM-DD HH:mm:ss')}] ${message} ${info.label === undefined ? '' : info.label}`;
    }),
    error_file_name: path.join(config.error_log_dir + "/" + moment().format('YYYY-MM-DD') + ".log")
};

/**
 * 创建logger实例
 */
const logger = createLogger({
    levels: winston_config.levels,
    format: combine(
        //format.colorize({all: true}), // all: ture 内容的颜色也变换 暂时关闭颜色，会导致log文件可读性差
        format.json(),
        format.splat(),
        format.simple(),
        winston_config.log_format
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: winston_config.error_file_name,
            level: 'error',
            colorize: false
        })
    ],
});

module.exports = logger;