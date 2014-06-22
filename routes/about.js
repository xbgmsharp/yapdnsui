var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res) {
  res.render('about', { 'navmenu': 'about' });
});

module.exports = router;
