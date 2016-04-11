'use strict';
const Crawler = require('simplecrawler');
const myCrawler = new Crawler('allissonazevedo.com');
const cheerio = require('cheerio');
let pages = [];

myCrawler.interval = 100;
myCrawler.maxConcurrency = 16;
myCrawler.stripQuerystring = true;

const verifyUrl = myCrawler.addFetchCondition((parsedURL, queueItem) => {
  if (
    parsedURL.path.match(/\.xml$/i) ||
    parsedURL.path.match(/\/feed\/$/i) ||
    parsedURL.path.match(/\/amp\/$/i)
  ) {
    return false;
  }
  return true;
});

myCrawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
  let $ = cheerio.load(responseBuffer);
  pages.push({ url: queueItem.url, title: $('title').text() });
});

myCrawler.start();

process.on('exit', () => {
  console.log(JSON.stringify(pages, null, 2));
});
