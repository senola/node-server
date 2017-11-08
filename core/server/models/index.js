/**
 * modals
 */
const fs = require('fs');
const path = require("path");
const Sequelize = require('sequelize');
const config = require('../config');
const logger = require('../utils/logger');

const db = {};

// 实例化sequelize
db.Op = Sequelize.Op; // 使用symbol操作符，防止注入
const sequelize = new Sequelize(config.database);



fs.readdirSync(__dirname).filter(file=> {
    // 排除index.js
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(file=> {
    const model = sequelize.import(path.join(__dirname, file));

    // 如果表未创建则先创建table
    model.sync({force: false}).then(()=> {
        logger.data('table:%s created success...', model.name);
    }).catch(error=> {
        logger.error('table:%s created failure...', model.name, error)
    });

    db[model.name] = model;
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
