/**
 * node-server
 */
// top of file
delete process.env["DEBUG_FD"];
const config = require('./config.default');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // 请求body解析中间件
const cookieParser = require('cookie-parser'); // cookie解析中间件
const session = require('express-session'); // session
const router = require('./core/server/router/router');
const requestLog = require('./core/server/middleware/request-log'); // cookie解析中间件
const logger = require('./core/server/utils/logger');

const app = express();

require('./core/server')();

const models = require('./core/server/models');

// 使用symbol操作符，防止注入
const Op = models.Op;
// models.user.findAll().then(user => {
//     logger.info('', user);
// });

app.use(cookieParser(config.cookieSecrect));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true,
    limit: '1mb'}));
// parse application/json
app.use(bodyParser.json({limit: '1mb'}));

// Request 日志。请求时间
app.use(requestLog);

// 静态资源文件
const staticDir = path.join(__dirname, 'static');

app.use('/static', express.static(staticDir));

// 环境健康检查
require('./core/server/utils/startup-check').check();



app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: config.development.cookieSecrect,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // 如果不是https，设置true 服务不能获取cookie
        maxAge: 60000
    }
}));

app.use('/', router); // router

// 默认是IPv6 address (::) 需要ip4的话，需要加上 "0.0.0.0"
app.listen(config.port, '0.0.0.0', ()=> {
    logger.warn('please visit http://%s:%s in the browser', config.host, config.port);
});
