/**
 * 程序启动环境检查
 * @time 2017-11-04
 */
const packages = require('../package.json');
const path = require('path');
const os = require('os');
const fs = require('fs');
const mode = process.env.NODE_ENV === undefined ? 'development' : process.env.NODE_ENV;
const appRoot = path.resolve(__dirname, '../');
const configFilePath = process.env.CONFIG || path.join(appRoot, 'config.default.js');
const logger = require('./logger');


const exitCodes = {
        NODE_VERSION_UNSUPPORTED: 231, // node 版本不支持
        NODE_ENV_CONFIG_MISSING: 232, // 默认配置文件丢失
        DEPENDENCIES_MISSING: 233, // 依赖丢失
        CONTENT_PATH_NOT_ACCESSIBLE: 234, // 目录不可访问
        CONTENT_PATH_NOT_WRITABLE: 235, // 不可写
        SQLITE_DB_NOT_WRITABLE: 236, // sqlite文件不可写
        BUILT_FILES_DO_NOT_EXIST: 237
      };

const checks = {
    check: function check() {
        this.systemInfo();
        this.nodeVersion();
        this.nodeEnv();
        this.packages();
        this.sqlite();
    },
    // 系统信息检测
    systemInfo() {
        //  操作系统CPU架构 'arm', 'arm64', 'ia32', 'mips', 'mipsel',
        // 'ppc', 'ppc64', 's390', 's390x', 'x32', 'x64', 和 'x86'.
        const arch = os.arch();
        // 空闲系统内存 的字节数
        const freemem = (os.freemem() / 1024 / 1024).toFixed(2);
        // 所有系统内存的字节数
        const totalmem = (os.totalmem() / 1024 / 1024).toFixed(2);
        // 主机名
        const hostname = os.hostname();
        // 被赋予网络地址的网络接口
        // const networkInterfaces = os.networkInterfaces();
        // 操作系统平台
        const platform = os.platform();
        // 操作系统的发行版
        const release = os.release();
        // 当前用户的home目录
        const homedir = os.homedir();

        logger.data('作系统主机名: %s', hostname);
        logger.data('操作系统信息：架构[%s] 操作系统平台[%s] 操作系统的发行版[%s]', arch, platform, release);
        logger.data('系统总内存：%sm 可用内存%sm', totalmem, freemem);
        logger.data('当前用户的home目录: %s', homedir);
        // logger.data(JSON.stringify(networkInterfaces));

    },
    // 确保node版本支持
    nodeVersion: function checkNodeVersion() {
        // 输出要求的node版本，同时推出node进程
        const semver = require('semver');

        if (process.env.NODE_VERSION_CHECK !== 'false' && !semver.satisfies(process.versions.node, packages.engines.node)) {
            logger.error('Unsupported version of Node');
            logger.error('this project needs Node version %s, you are using version %s', packages.engines.node,  process.versions.node);
            process.exit(exitCodes.NODE_VERSION_UNSUPPORTED);
        }
        logger.info('node 版本检测正常.');
    },
    // 确保配置文件合法
    nodeEnv: function checkNodeEnvState() {
        // 检查配置是否合法
        let configFile,
            config;

        configFile = require(configFilePath);
        config = configFile[mode]; // mode[development/production]

        if (!config) {
            logger.error('Cannot find the configuration for the current NODE_ENV %s', mode);
            logger.error('Ensure your config.default.js has a section for the current NODE_ENV value' +
                ' and is formatted properly.');
            process.exit(exitCodes.NODE_ENV_CONFIG_MISSING);
        }
        logger.info('配置文件检测正常.');
    },
    // 确保依赖库完整
    packages: function checkPackages() {
        if (mode !== 'production' && mode !== 'development') {
            return;
        }

        let errors = [];

        Object.keys(packages.dependencies).forEach(function (p) {
            try {
                require.resolve(p);
            } catch (e) {
                errors.push(e.message);
            }
        });

        if (!errors.length) {
            logger.info('packages dependencies 依赖库检测正常.');
            return;
        }

        errors = errors.join('\n  ');

        logger.error('server is unable to start due to missing dependencies' );
        logger.error(errors);
        logger.error('Please run `npm install --production` and try starting server again.');
        process.exit(exitCodes.DEPENDENCIES_MISSING);
    },
    // 检查sqlite3是否可读可写
    sqlite: function checkSqlite() {
        if (mode !== 'production' && mode !== 'development') {
            return;
        }

        let configFile,
            config,
            appRoot = path.resolve(__dirname, '../'),
            dbPath,
            fd;

        try {
            configFile = require(configFilePath);
            config = configFile[mode];

            // 检查是否使用的是 sqlite3
            if (config && config.database && config.database.client !== 'sqlite3') {
                return;
            }

            if (config && config.database && config.database.connection) {
                dbPath = config.database.connection.filename;
            }
        } catch (e) {
            // 如果默认配置不存在则启用默认db文件
            dbPath = path.join(appRoot, 'data', mode === 'production' ? 'data.db' : 'data-dev.db');
        }

        // Check for read/write access on sqlite db file
        try {
            fd = fs.openSync(dbPath, 'r+');
            fs.closeSync(fd);
        } catch (e) {
            // Database file not existing is not an error as sqlite will create it.
            if (e.code === 'ENOENT') {
                return;
            }

            logger.error('nable to open sqlite3 database file for read/write\n %s', e.message);
            logger.error('heck that the sqlite3 database file permissions allow read and write access.');
            process.exit(exitCodes.SQLITE_DB_NOT_WRITABLE);
        }
        logger.info('sqlite数据库文件读写权限检测正常.');
    },
};

module.exports = checks;