'use strict';
const cheerio = require('cheerio');
const Crawler = require('simplecrawler');
const myCrawler = new Crawler('www.tudogostoso.com.br');
const re = /\/receita\/([0-9]+)-([\w-]+)\.html$/i;
const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

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

function parseResponse(queueItem, responseBuffer) {
  let $ = cheerio.load(responseBuffer);
  let recipe = {};
  recipe.url = queueItem.url;
  recipe.name = $('.recipe-title h1').text().trim();
  recipe.image = $('.photo.pic.u-photo').attr('src');
  recipe.ingredients = [];
  $('.p-ingredient').each((i, element) => {
    recipe.ingredients.push($(element).text());
  });
  recipe.instructions = [];
  $('.instructions.e-instructions li').each((i, element) => {
    recipe.instructions.push($(element).text());
  });
  recipe.yield = $('.p-yield.num yield').attr('value');
  recipe.preptime = $('.dt-duration').attr('datetime');
  return recipe;
}

function indexRecipe(recipe) {
  recipe.image = recipe.image.split('?')[0];
  recipe.image = recipe.image + '?mode=crop&width=350&height=230'
  client.index({
    index: 'crawler',
    type: 'recipe',
    body: recipe
  }, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      console.log(response);
    }
  });
};

myCrawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
  if (!re.test(queueItem.url)) {
    return;
  }
  let recipe = parseResponse(queueItem, responseBuffer);
  if (!recipe.image) {
    return;
  }
  indexRecipe(recipe);
});

myCrawler.start();
