/**
 * 定义t_user表
 * @param sequelize
 * @param DataTypes
 * @returns {*}
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {type:DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
        uuid: {type:DataTypes.STRING, allowNull: false, unique: true},
        name: {type:DataTypes.STRING, allowNull: false},
        status: {type: DataTypes.INTEGER, nullable: true, defaultValue: 0}, // （0：正常[默认值]，1，-1：不正常）
        description: {type: 'string', maxlength: 200, nullable: true},
        lastLoginTime: {type: 'dateTime', nullable: true, defaultValue: DataTypes.NOW},
        createTime: {type: 'dateTime', nullable: false, defaultValue: DataTypes.NOW},
        updateTime: {type: 'dateTime', nullable: true, defaultValue: DataTypes.NOW}
    },{
        tableName: 't_user', // 定义表名
        freezeTableName: true, // 冻结表名，不轻易修改
        indexes: [
            {
                unique: true,
                fields:['uuid'] // 創建uuid的索引，默认的索引名字为： [table]_[fields]
            }
        ],
        comment: "用户表"
    });
};
