'use strict';
const Crawler = require('simplecrawler');
const myCrawler = new Crawler('www.tudogostoso.com.br');

myCrawler.interval = 100;
myCrawler.stripQuerystring = true;
myCrawler.maxConcurrency = 16;

const verifyUrl = myCrawler.addFetchCondition((parsedURL, queueItem) => {
  if (
    parsedURL.path.match(/\.ico$/i) ||
    parsedURL.path.match(/\.css$/i) ||
    parsedURL.path.match(/\.png$/i) ||
    parsedURL.path.match(/\.gif$/i) ||
    parsedURL.path.match(/\.jpg$/i) ||
    parsedURL.path.match(/\.js$/i) ||
    parsedURL.path.match(/print_recipe\.php/i) ||
    parsedURL.path.match(/\/print$/i)
  ) {
    return false;
  }
  return true;
});

myCrawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
  console.log(queueItem.url);
});

myCrawler.start();
