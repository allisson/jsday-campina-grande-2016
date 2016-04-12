'use strict';
const express = require('express');
const router = express.Router();
const client = require('../lib/elasticsearch');
const pagination = require('pagination');

router.use((req, res, next) => {
  let page = 1;
  if (req.query.page) {
    page = req.query.page;
  }
  let limit = 15;
  let offset = (page - 1) * limit;
  req.limit = limit;
  req.offset = offset;
  req.page = page;
  next();
});

router.get('/', (req, res, next) => {
  if (req.query.q) {
    client.search({
      index: 'crawler',
      q: req.query.q,
      size: req.limit,
      from: req.offset
    }, (error, response) => {
      let paginator = new pagination.SearchPaginator({
        prelink: '/',
        current: req.page,
        rowsPerPage: req.limit,
        totalResult: response.hits.total
      });
      res.render(
        'index', {
          q: req.query.q,
          result: response,
          paginator: paginator.getPaginationData()
        }
      );
    });
  } else {
    res.render('index');
  }

});

module.exports = router;
