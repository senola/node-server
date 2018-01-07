/**
 * puppeteer event
 * @time 2018-01-06
 */

const logger = require('../../utils/logger');

/**
 *
 * @param browser
 */
async function handleBrowserEvent(browser) {
    logger.info('browser version: ' + await browser.version());
    browser.on('targetcreated', target=> {
        // console.log(target);
    });
}

/**
 *
 * @param page
 */
async function handlePageEvent(page) {

    page.on('error', err=> {
        logger.info('出错了: ' + err);
    });

    page.on('pageerror', err=> {
        logger.info('页面出错了: ' + err);
    });

    page.on('load', ()=> {

    });

    page.on('console', msg => {
        for (let i = 0; i < msg.args.length; ++i)
            console.log(`${i}: ${msg.args[i]}`);
    });
}

module.exports = {
    handleBrowserEvent,
    handlePageEvent
};
