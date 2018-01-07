/**
 * 定义t_novels_category表
 * @param sequelize
 * @param DataTypes
 * @returns {*}
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('NovelsCategory', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        categoryName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        novelRelateId: {
            type: DataTypes.INTEGER,
            allowNull: false
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
        tableName: 't_novels_category', // 定义表名
        freezeTableName: true, // 冻结表名，不轻易修改
        indexes: [
            {
                unique: true,
                fields: ['categoryName'] // 創建uuid的索引，默认的索引名字为： [table]_[fields]
            }
        ]
    });
};
