var express = require('express');
var router = express.Router();
var client = require('../lib/elasticsearch');

router.get('/', function(req, res, next) {
  if (req.query.q) {
    client.search({
      index: 'crawler',
      q: req.query.q
    }, function(error, response) {
      res.render('index', {result: response});
    });
  } else {
    res.render('index');
  }

});

module.exports = router;
