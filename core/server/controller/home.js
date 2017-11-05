/**
 * 首页
 */
const logger = require('../utils/logger');

const home = function(req, res, next) {
    if (req.session.views) {
        req.session.views++;
        res.setHeader('Content-Type', 'text/html');
        res.write('<p>views: ' + req.session.views + '</p>');
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>');
        res.end();
    } else {
        req.session.views = 1;
        res.end('welcome to the session demo. refresh!');
    }
    next();
};

module.exports = home;
