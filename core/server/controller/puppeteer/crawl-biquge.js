/**
 * crawl biquge novels
 * @author 潭风
 * @time 2018-01-07
 */
const puppeteer = require('puppeteer');
const { handleBrowserEvent, handlePageEvent } = require('./puppeteerEvent');
const Models = require('../../models');

const crawlBiQuGe = async function() {

    const browser = await puppeteer.launch({headless: false});
    handleBrowserEvent(browser);
    const page = await browser.newPage();
    // 设置视口大小
    await page.setViewport({
        width: 1500,
        height: 700
    });
    await page.goto('http://www.biquge5200.com/38_38857/', {
        waitUntil: 'domcontentloaded'
    });

    handlePageEvent(page);

    let bookInfo = await page.evaluate(()=> {
        const title = document.querySelector('#info > h1').innerText;
        const author = document.querySelector('#info > p:nth-child(2)').innerText.split('：')[1].trim();
        const updateTime = document.querySelector('#info > p:nth-child(4)').innerText.split('：')[1].trim();
        const coverImage = document.querySelector('#fmimg > img').getAttribute('src');
        const introduce = document.querySelector('#intro > p').innerText;
        // 获取所有的章节链接
        const chapters = Array.from(document.querySelectorAll('#list > dl > dt:nth-child(12) ~dd > a')).map(item=>{
            return item.href;
        });

        return {
            title,
            author,
            introduce,
            coverImage,
            updateTime,
            chapters
        };
    });

    const novel = await Models.Novels.findOrCreate({
        where: {
            title: bookInfo.title
        },
        defaults: bookInfo
    });
    console.log('开始爬取小说: 《' + bookInfo.title + "》");

    for(let i = 1249; i < bookInfo.chapters.length; i++) {

        try {
            await page.goto(bookInfo.chapters[i],{
                waitUntil: 'domcontentloaded'
            });
        } catch (err) {
            console.log(err);
            browser.close();
        }

        const detailChapterInfo = await page.evaluate(()=> {
            const chapterTitle = document.querySelector('#wrapper > div.content_read > div > div.bookname > h1').innerText;
            const chapterContent = document.querySelector('#content').innerText;

            return {
                chapterTitle,
                chapterContent
            }
        });
        detailChapterInfo.novelRelateId = novel[0].dataValues.id;
        detailChapterInfo.chapterOrder = i + 1;
        detailChapterInfo.createTime = new Date();

        const chapter = await Models.NovelsChapters.findOrCreate({
            where: {
                chapterOrder: detailChapterInfo.chapterOrder
            },
            defaults: detailChapterInfo
        });

        //await page.waitFor(8000);
    }

    console.log('爬取完成!');
    await browser.close();
};

module.exports = crawlBiQuGe;
