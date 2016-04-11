'use strict';
const Crawler = require('simplecrawler');
const myCrawler = new Crawler('www.tudogostoso.com.br');

myCrawler.interval = 100;
myCrawler.stripQuerystring = true;
myCrawler.maxConcurrency = 16;

myCrawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
  console.log(queueItem.url);
});

myCrawler.start();
