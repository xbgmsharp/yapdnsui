var express = require('express');
var router = express.Router();
var request = require('request');
var db = require('./db.js');

/* GET server page. */
router.get('/', function(req, res) {
	if (!req.db) { res.redirect('/'); }
	db.list(req, res, null, function(req, res, json, rows) {
		if (rows && req.query.server) {
			res.serverlist = rows;
			db.get(req, res, function(req, res, serverselected) {
				console.log(serverselected);
				res.render('server', { 'serverlist': res.serverlist, 'navmenu': '', 'serverselected': serverselected });
			});
		} else {
			res.render('server', { 'serverlist': rows, 'navmenu': '' });
		}
	});
});

/* POST to Add User Service */
router.post('/', function(req, res) {
        console.log(req.db);
        // Redirect to index if missing value
        if (!req.db || !req.body.url || !req.body.password) { res.redirect('/server'); }
        // Do the job
        db.add(req, res, function(req, res) {
		res.redirect('/server');
        });
});

module.exports = router;
