/**
 * 定义t_post表
 * @param sequelize
 * @param DataTypes
 * @returns {*}
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('t_post', {
        id: {type:DataTypes.INTEGER, allowNull: false, primaryKey: true},
        uuid: {type:DataTypes.STRING, allowNull: false},
        name: {type:DataTypes.STRING, allowNull: false}
    },{
        tableName: 't_post', // 定义表名
        freezeTableName: true, // 冻结表名，不轻易修改
    });
};
