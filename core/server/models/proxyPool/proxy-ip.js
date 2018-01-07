/**
 * 定义t_proxy_ip表
 * @param sequelize
 * @param DataTypes
 * @returns {*}
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('ProxyIp', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true,
            autoIncrement: true
        },
        ipAddress: { // ip地址
            type: DataTypes.STRING,
            allowNull: false
        },
        port: { // ip地址对应的端口
            type: DataTypes.INTEGER,
            allowNull: false
        },
        serverAddress: { // 服务器所在地区
            type: DataTypes.STRING,
            allowNull: true
        },
        httpType: { // 0：http, 1: https
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        proxyType: { // 代理类型：0：其他，1： 国内代理， 2： 国外代理
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        createTime: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        updateTime: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 't_proxy_ip', // 定义表名
        freezeTableName: true // 冻结表名，不轻易修改
    });
};
