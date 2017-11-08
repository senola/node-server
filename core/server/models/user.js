/**
 * 定义t_user表
 * @param sequelize
 * @param DataTypes
 * @returns {*}
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {type:DataTypes.INTEGER, allowNull: false, primaryKey: true},
        uuid: {type:DataTypes.STRING, allowNull: false},
        name: {type:DataTypes.STRING, allowNull: false}
    },{
        tableName: 't_user', // 定义表名
        freezeTableName: true, // 冻结表名，不轻易修改
    });
};
