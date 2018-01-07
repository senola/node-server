/**
 * 定义t_novels表
 * @param sequelize
 * @param DataTypes
 * @returns {*}
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Novels', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true,
            autoIncrement: true
        },
        author: { // 作者
            type: DataTypes.STRING,
            allowNull: false
        },
        title: { // 小说名称
            type: DataTypes.STRING,
            allowNull: false
        },
        introduce: {
            type: DataTypes.STRING,
            allowNull: true
        },
        coverImage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        readerNum: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
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
        tableName: 't_novels', // 定义表名
        freezeTableName: true, // 冻结表名，不轻易修改
        indexes: [
            {
                unique: true,
                fields: ['author', 'title'] // 創建uuid的索引，默认的索引名字为： [table]_[fields]
            }
        ]
    });
};
