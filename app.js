/**
 * node-server
 */
const config = require('./config.default');


const express = require('express');
// bodyParser = require('body-parser'), // 请求body解析中间件
// morgan = require('morgan'), // HTTP请求日志中间件
// cookieParser = require('cookie-parser'), //cookie解析中间件
// flash = require("connect-flash"); // The flash is a special area of the session used for storing messages
const logger = require('./utils/logger');
const app = express();

app.get('/', (req, res)=> {
    res.send('我是首页');
});

app.get('/about', (req, res)=> {
    res.send('关于');
});

app.listen(config.port, ()=> {
    logger.warn('sever was listen on %s ...', config.port);
});
