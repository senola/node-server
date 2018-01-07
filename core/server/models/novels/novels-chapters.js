/**
 * 定义t_novels_chapters表
 * @param sequelize
 * @param DataTypes
 * @returns {*}
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('NovelsChapters', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        novelRelateId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        chapterOrder: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        chapterTitle: {
            type: DataTypes.STRING,
            allowNull: true
        },
        chapterContent: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        createTime: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updateTime: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 't_novels_chapters', // 定义表名
        freezeTableName: true, // 冻结表名，不轻易修改
        indexes: [
            {
                unique: true,
                fields: ['chapterTitle'] // 创建uuid的索引，默认的索引名字为： [table]_[fields]
            }
        ]
    });
};
