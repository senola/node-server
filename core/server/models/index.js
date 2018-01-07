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
config.database.operatorsAliases = Sequelize.Op; // 使用symbol操作符，防止注入
//const sequelize = new Sequelize(config.database);
const sequelize = new Sequelize('test', 'root', '', config.database);


/**
 * 动态获取models
 */
function getFileSync(rootPath) {
    fs.readdirSync(rootPath).filter(file=> {
        return file !== 'index.js';
    }).forEach(file=> {
        const _path = path.join(rootPath, file);
        const info = fs.statSync(_path);
        if(info.isDirectory()) { // 如果是目录继续编辑
            getFileSync(_path);
            return;
        }

        const model = sequelize.import(_path);
        // 如果表未创建则先创建table
        model.sync({force: false}).then(()=> {
            logger.data('table:%s created success...', model.tableName);
        }).catch(error=> {
            logger.error('table:%s created failure...', model.tableName, error)
        });

        db[model.name] = model;
    });
}
getFileSync(__dirname);

db.sequelize = sequelize; // 实例
db.Sequelize = Sequelize; // 类

module.exports = db;
