/**
 * 首页
 */
const logger = require('../utils/logger');
const models = require('../models');
const uuid = require('../utils/uuid');
const moment = require('moment');

const home = function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    models.user.findAll().then(user=> {
        res.write('<p>session: ' + req.session.id + '</p>');
        res.write('<p>查询用户user: ' + JSON.stringify(user) + '</p>');
        res.end();
        next();
    });
    // models.user.findAll().then(users=> {
    //     res.write('<p>session: ' + req.session.id + '</p>');
    //     res.write('<p>users: ' + JSON.stringify(users) + '</p>');
    //     res.end();
    //     next();
    // });

    // if (req.session.views) {
    //     req.session.views++;
    //     res.setHeader('Content-Type', 'text/html');
    //     res.write('<p>session: ' + req.session.id + '</p>');
    //     res.write('<p>views: ' + req.session.views + '</p>');
    //     res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>');
    //     res.end();
    // } else {
    //     req.session.views = 1;
    //     res.end('welcome to the session demo. refresh!');
    // }
};

module.exports = home;
