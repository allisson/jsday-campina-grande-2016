'use strict';
const request = require('request');
const cheerio = require('cheerio');
const startUrl = 'https://allissonazevedo.com/';
const hostname = new RegExp(startUrl);
let urlSet = new Set();
let pages = [];

function normalizeUrl(url) {
  return url.split('?')[0].split('#')[0];
}

function verifyUrl(url) {
  if (
    url.match(/\.xml$/i) ||
    url.match(/\/feed\/$/i) ||
    url.match(/\/amp\/$/i)
  ) {
    return false;
  }
  return true;
}

function getPage(url) {
  url = normalizeUrl(url);
  if (urlSet.has(url)) {
    return;
  }
  if (!verifyUrl(url)) {
    return;
  }
  urlSet.add(url);
  request(url, (error, response, body) => {
    if (error || response.statusCode != 200) {
      return;
    }
    let $ = cheerio.load(body);
    pages.push({ url: url, title: $('title').text() });
    $('[href]').each((i, element) => {
      let newUrl = normalizeUrl($(element).attr('href'));
      if (hostname.test(newUrl)) {
        getPage(newUrl);
      }
    });

  });
};

getPage(startUrl);

process.on('exit', () => {
  console.log(JSON.stringify(pages, null, 2));
});
