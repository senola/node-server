/**
 * puppeteer
 * @time 2018-01-06
 */

const crawlBiQuGe = require('./crawl-biquge');
const crawlProxyIp = require('./crawl-proxy-ip');
const goubanjia = require('./crawl-goubanjia');
const { proxyCheck, checkExistIp } = require('../../utils/proxyCheck');


const init = async function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    res.write('<p>sessionId: ' + req.session.id + '</p>');

    // crawlBiQuGe();
    // console.log('=====> ' + await proxyCheck({
    //     ipAddress: req.query.ip,
    //     port: req.query.port,
    //     serverAddress: 'other'
    // }));
    crawlProxyIp();
    goubanjia();
    // checkExistIp();

    res.end();
    next();
};

module.exports = init;
