/**
 * crawl biquge novels
 * @author 潭风
 * @time 2018-01-07
 */
const puppeteer = require('puppeteer');
const { handleBrowserEvent, handlePageEvent } = require('./puppeteerEvent');
const Models = require('../../models');
const proxyCheck = require('../../utils/proxyCheck');

const crawlProxyIp = async function() {

    const browser = await puppeteer.launch({headless: true});
    handleBrowserEvent(browser);
    const page = await browser.newPage();

    // 设置视口大小
    await page.setViewport({
        width: 1500,
        height: 700
    });
    // /**
    //  *  将 proxyCheck方法注入到页面的window对象，方面page.evaluate()调用
    //  */
    // await page.exposeFunction('proxyCheck', async (options) =>
    //     proxyCheck(options)
    // );

    for(let i = 1; i < 2; i++) {
        await page.goto('http://www.xicidaili.com/wt/' + i, {
            waitUntil: 'domcontentloaded'
        });
        console.log('> 当前爬取的url： ' + await page.url());

        handlePageEvent(page);

        // 抓取IP列表
        let IpList = await page.evaluate(()=> {
            const result = [];
            document.querySelectorAll('#ip_list > tbody > tr:nth-child(1) ~tr').forEach(async item=> {
                const ipAddress = item.children[1].innerText; // ipAddress
                const port = item.children[2].innerText; // port
                const serverAddress = item.children[3].innerText; // serverAddress
                const httpType = item.children[3].innerText.trim().toUpperCase() === 'HTTPS' ? 1 : 0; // 0：http, 1: https

                result.push({
                    ipAddress,
                    port,
                    serverAddress,
                    httpType,
                    proxyType: 1
                });
            });
            return result;
        });
        console.log(IpList);

        // 获取有效列表
        const validIpList = [];
        for(let i = 0; i < IpList.length; i++) {
            const isOK = await proxyCheck(IpList[i]);
            if(isOK) {
                validIpList.push(IpList[i]);
                console.log('【' + IpList[i].serverAddress + ' '+ IpList[i].ipAddress + ":" + IpList[i].port + '】代理有效。');

                // 数据持久化
                await Models.ProxyIp.findOrCreate({
                    where: {
                        ipAddress: IpList[i].ipAddress
                    },
                    defaults: IpList[i]
                });
            }
        }
        console.log(validIpList);
    }

    console.log('爬取完成!');
    await browser.close();
};

module.exports = crawlProxyIp;
