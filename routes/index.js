var express = require('express');
var database = require('../libs/db');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (!req.db) { res.render('', {}); }
  database.list(req, res, function(req, res, rows) {
           res.render('', { 'serverlist': rows, 'navmenu': '' });
     });
});

module.exports = router;
