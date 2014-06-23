var express = require('express');
var router = express.Router();
var pdnsapi = require('../libs/pdnsapi');
var db = require('../libs/db');

/* GET domains page. */
router.get('/', function(req, res) {
        console.log(req.db);
        // If missing value redirect to index or to an error page!!!
        if (!req.db || !req.query.server) { res.redirect('/'); }
        // Get server from DB
        db.get(req, res, function(req, res, row) {
		// If any error redirect to index or to an error page!!!
                if (!row){ res.redirect('/'); }
                else {
                        pdnsapi.zones(req, res, row, function (error, response, server, body) {
				// If any error redirect to index
                                if (!body) { console.log(error); res.redirect('/'); }
                                else {
                                        var json = JSON.parse(body);
                                        console.log(json);
                                        db.list(req, res, json, function(req, res, json, rows) {
                                                var obj = {};
                                                obj.name = req.query.server; // TODO Avoid doing a second DB query
                                                res.render('domains', { 'data': json, 'serverlist': rows, 'navmenu': 'configuration', 'serverselected': obj});
                                        });
                                }
                        });
                }
        });
});

module.exports = router;
