/**
 * puppeteer
 * @time 2018-01-06
 */

const crawlBiQuGe = require('./crawl-biquge');
const crawlProxyIp = require('./crawl-proxy-ip');
const proxyCheck = require('../../utils/proxyCheck');


const init = async function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    res.write('<p>sessionId: ' + req.session.id + '</p>');

    // crawlBiQuGe();
    // console.log('=====> ' + await proxyCheck({
    //     ipAddress: '87.250.221.3',
    //     port: 8080,
    //     serverAddress: '广西壮族自治区百色市 联通'
    // }));
    crawlProxyIp();
    res.end();
    next();
};

module.exports = init;
