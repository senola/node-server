/**
 * 代理测试工具
 * @return true: 代理可用， false: 代理无效
 * @time 2018-01-07
 */
const axios = require('axios');
const api = 'http://cnodejs.org/api/v1/topics'; // 使用cnodejs社区API做测试
const Model = require('../models');

const checkExistIp = async function () {
    const proxyIps = await Model.ProxyIp.findAll();

    for(let i = 0; i < proxyIps.length; i++) {
        if(! await proxyCheck(proxyIps[i])) {
            // 删除无效代理
            const deleteItem = await Model.ProxyIp.destroy({
                where: {
                    id: proxyIps[i].id
                }
            });
            const result = '【' + proxyIps[i].serverAddress + ' '+ proxyIps[i].ipAddress + ":" + proxyIps[i].port + '】已清理';
            console.log(deleteItem === 1 ? result : '');
        }
    }
    console.log('\n 清理完成, 一共有【' +  await Model.ProxyIp.count() + '】 个有效IP');
};

const proxyCheck = async function(options, checkExistIp) {
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
        console.log('【' + options.serverAddress + ' '+ options.ipAddress + ":" + options.port + '】代理有效。');
        return res.status >= 200 && res.status < 400;
    } catch (err) {
        console.log('【' + options.serverAddress + ' '+ options.ipAddress + ":" + options.port + '】代理无效。' + err);
        return false;
    }
};

module.exports = {
    proxyCheck,
    checkExistIp
};
