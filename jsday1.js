'use strict';
const request = require('request');
const cheerio = require('cheerio');

request('http://jsday.com.br/speakers/', (error, response, body) => {
  let $ = cheerio.load(body);
  let speakers = [];
  $('.people-modal').each((i, element) => {
    let speaker = {};
    speaker.title = $(element).find('h4').text();
    speaker.description = $(element).find('.theme-description').text();
    speaker.name = $(element).find('.name').contents()[0].data.trim();
    speaker.about = $(element).find('.about').text();
    speaker.image = $(element).find('.people-img').css('background-image').replace('url(', '').replace(')', '');
    speakers.push(speaker);
  });
  console.log(JSON.stringify(speakers, null, 2));
});
