var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  if (!req.db || !req.query.server) { res.redirect('/'); }
  else { res.render('statistics', { 'navmenu': 'statistics' }); }
});

module.exports = router;
