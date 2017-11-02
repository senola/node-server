/**
 * 请求日志中间件
 */

const logger = require('../utils/logger');

const ignore = /^\/(public|agent)/;

module.exports = (req, res, next)=> {
    // 静态资源文件不打印日志
    if(ignore.test(req.url)) {
        next();
        return;
    }

    const beginTime = new Date();

    res.on('finish', ()=> {
        const duration = new Date() - beginTime;

        logger.info('[%s] %s %s (%s ms)', req.method, req.url, req.ip, duration);
    });

    // 确保请求继续执行
    next();
};

