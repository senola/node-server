/**
 * node-server
 */
const config = require('./config/config.default');


var express = require("express"),
    bodyParser = require("body-parser"), //请求body解析中间件
    morgan = require('morgan'), // HTTP请求日志中间件
    cookieParser = require('cookie-parser'), //cookie解析中间件
    flash = require("connect-flash"); //The flash is a special area of the session used for storing messages
var colors = require('colors');
var app = express();

// console.log('hello'.green); // outputs green text
// console.log('i like cake and pies'.underline.red) // outputs red underlined text
// console.log('inverse the color'.inverse); // inverses the color
// console.log('OMG Rainbows!'.rainbow); // rainbow
// console.log('Run the trap'.trap); // Drops the bass
// console.log(config.host.inverse.bgGreen); // Drops the bass


const logger = require('./common/logger');

// logger.debug('test message %s, %s', 'first', 'second',{ number: 123 });
logger.error("服务器异常, 服务器名称: %s, id: %s", "127.0.0.1", "1254", {number: 123});
logger.error("服务器异常, 服务器名称: %s, id: %s", "127.0.0.1", "1254", {number: 123});
logger.error("服务器异常, 服务器名称: %s, id: %s", "127.0.0.1", "1254", {number: 123});
logger.error("服务器异常, 服务器名称: %s, id: %s", "127.0.0.1", "1254", {number: 123});
logger.error("服务器异常, 服务器名称: %s, id: %s", "127.0.0.1", "1254", {number: 123});
logger.error("服务器异常, 服务器名称: %s, id: %s", "127.0.0.1", "1254", {number: 123});
logger.error("服务器异常, 服务器名称: %s, id: %s", "127.0.0.1", "1254", {number: 123});
logger.error("服务器异常, 服务器名称: %s, id: %s", "127.0.0.1", "1254", {number: 123});
logger.error("服务器异常, 服务器名称: %s, id: %s", "127.0.0.1", "1254", {number: 123});
logger.error("服务器异常, 服务器名称: %s, id: %s", "127.0.0.1", "1254", {number: 123});
logger.error("服务器异常, 服务器名称: %s, id: %s", "127.0.0.1", "1254", {number: 123});
logger.error("服务器异常, 服务器名称: %s, id: %s", "127.0.0.1", "1254", {number: 123});
logger.error("服务器异常, 服务器名称: %s, id: %s", "127.0.0.1", "1254", {number: 123});
logger.error("服务器异常, 服务器名称: %s, id: %s", "127.0.0.1", "1254", {number: 123});
logger.error("服务器异常, 服务器名称: %s, id: %s", "127.0.0.1", "1254", {number: 123});


module.exports = app;
