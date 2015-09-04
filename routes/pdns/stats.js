var express = require('express');
var database = require('../../libs/db');
var pdnsapi = require('../../libs/pdnsapi');
var router = express.Router();

// Route middleware to validate :id
// Execute for all request
// It return the full server object from the DB
router.param('id', function(req, res, next, id){
        console.log("server_id: [%s]", id);
        if (parseInt(id)) {
                database.get(req, res, id, function(err, server){
                        if (err) {
                                return next(err);
                        }
                        else if (!server) {
                                return next(new Error('failed to load server'));
                        }
                        req.server = server;
                        database.list(req, res, function(req, res, rows) {
                                if (!rows) {
                                        return next(new Error('failed to load servers'));
                                }
                                req.serverlist = rows;
                                next();
                        });
                });
        } else { next(); }
});

/* -------------------------------------------------*/
/* STATS */

/* GET stats page. */
router.get('/:id/statistics', function(req, res) {
  if (!req.db && !req.server) { res.render('', {}); }
  res.render('statistics', { 'serverlist': req.serverlist, 'navmenu': 'statistics', 'serverselected': req.server });
});

/* GET the statistics dump for graph */
router.get('/:id/statistics/dump', function(req, res) {
        console.log(req.db);
        console.log(req.params);
        console.log(req.params.id);
        // If missing value redirect to index or to an error page!!!
        if (!req.db && !req.server) { res.redirect('/'); }
        pdnsapi.stats.statistics(req, res, function (error, response, body) {
	       	if (!body) { console.log(error); res.send(myJsonString, {'Content-type': 'text/json'}, 200); }
                else {
	                // Do more stuff with 'body' here
	                //console.log(req);
	                //console.log(body);
	                var json = JSON.parse(body);
	                var timestamp = new Date().getTime(); // current time
		        //var timestamp = req.query._;
	                var arr = {};
	                //console.log(json);
	                for (i in json) {
	                        console.log(json[i].name);
	                        arr[json[i].name] = [timestamp, parseInt(json[i].value)];
	                }
	                //console.log(arr);
        	        var myJsonString = JSON.stringify(arr);
	                console.log(myJsonString);
	                res.send(myJsonString, {'Content-type': 'text/json'}, 200);
	              }
        });
});

module.exports = router;
