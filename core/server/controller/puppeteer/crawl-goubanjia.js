/**
 * crawl http://www.goubanjia.com/ 全网代理IP
 */

const puppeteer = require('puppeteer');
const { handleBrowserEvent, handlePageEvent } = require('./puppeteerEvent');
const Models = require('../../models');
const proxyCheck = require('../../utils/proxyCheck');

const crawlGouBanjia = async function () {

    const browser = await puppeteer.launch({headless: true});
    handleBrowserEvent(browser);
    const page = await browser.newPage();

    handlePageEvent(page);

    // 设置视口大小
    await page.setViewport({
        width: 1500,
        height: 700
    });

    const CRAWL_PAGE_NUM = 3; // 抓取的页面数
    const CRAWL_PAGE_URL = ['http://www.goubanjia.com/free/index',
                            'http://www.goubanjia.com/free/gngn/index',
                            'http://www.goubanjia.com/free/gnpt/index',
                            'http://www.goubanjia.com/free/gwgn/index',
                            'http://www.goubanjia.com/free/gwpt/index']; // 抓取的页面地址

    for(let j = 0; j < CRAWL_PAGE_URL.length; j++) {
        for(let i = 1; i < CRAWL_PAGE_NUM; i++) {
            const url = CRAWL_PAGE_URL[j] + i + '.shtml';
            await page.goto(url, {
                waitUntil: 'domcontentloaded'
            });
            console.log('> 当前爬取的url：' + url);

            // 抓取IP列表
            let IpList = await page.evaluate(()=> {
                const result = [];
                document.querySelectorAll('#list > table > tbody > tr').forEach(async item=> {
                    const _array = item.children[0].innerText.split(':');
                    const ipAddress = _array[0]; // ipAddress
                    const port = _array[1]; // port

                    const serverAddress = item.children[3].innerText.trim().replace(/\s/g, ''); // serverAddress
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

            // 获取有效列表
            const validIpList = [];
            for(let i = 0; i < IpList.length; i++) {
                const isOK = await proxyCheck(IpList[i]);
                if(isOK) {
                    validIpList.push(IpList[i]);


                    // 数据持久化
                    await Models.ProxyIp.findOrCreate({
                        where: {
                            ipAddress: IpList[i].ipAddress
                        },
                        defaults: IpList[i]
                    });
                }
            }
        }
    }

    console.log('爬取完成!');
    await browser.close();
};

module.exports = crawlGouBanjia;
