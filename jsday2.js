'use strict';
const request = require('request');
const cheerio = require('cheerio');

request('http://jsday.com.br/schedule/', (error, response, body) => {
  let $ = cheerio.load(body);
  let subEvents = [];
  $('.timeslot[itemtype="http://schema.org/subEvent"]').each((i, element) => {
    let event = {};
    event.title = $(element).find('.slot-title').text();
    event.time = $(element).find('.start-time').attr('datetime');
    subEvents.push(event);
  });
  console.log(JSON.stringify(subEvents, null, 2));
});
