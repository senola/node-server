/**
 * 代理测试工具
 * @return true: 代理可用， false: 代理无效
 * @time 2018-01-07
 */
const axios = require('axios');
const api = 'http://cnodejs.org/api/v1/topics'; // 使用cnodejs社区API做测试

const proxyCheck = async function(options) {
    try {
        const res = await axios.request({
            url: api,
            method: 'get',
            timeout: 2000,
            responseType: 'json',
            proxy: {
                host: options.ipAddress,
                port: options.port
            }
        });
        return res.status >= 200 && res.status < 400;
    } catch (err) {
        console.log('【' + options.serverAddress + ' '+ options.ipAddress + ":" + options.port + '】代理无效。' + err);
        return false;
    }
};

module.exports = proxyCheck;
