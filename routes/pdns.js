var express = require('express');
var database = require('../libs/db');
var pdnsapi = require('../libs/pdnsapi');
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

/* GET servers page. */
router.get('/', function(req, res) {
	if (!req.db) { res.redirect('/'); }
	database.list(req, res, function(req, res, rows) {
		res.render('servers', { 'serverlist': rows, 'navmenu': '' });
	});
});

/* POST to add server Service */
router.post('/add', function(req, res) {
        console.log(req.db);
        console.log(req.body);
        // Redirect to index if missing value
        if (!req.db && !req.body.url && !req.body.password) { res.redirect('/servers'); }
        // Do the job
	console.log("Add entry in db");
        database.add(req, res, function(req, res) {
		res.redirect('/servers');
        });
});

/* Now we have the servers set up, let use it as a middleware */
/* All page below require a valid server and DB */

/* GET servers page. */
router.get('/:id', function(req, res) {
	if (!req.db && !req.server) { res.redirect('/'); }
	pdnsapi.config.servers(req, res, function (error, response, body) {
                              // If any error redirect to index
                              if (!response || response.statusCode != 200) {
					console.log("Error: connection failed");
                                        res.msg = {};
                                        res.msg.class="alert-warning";
                                        res.msg.title="Error!";
                                        res.msg.msg= "Connection failed to "+ req.server.name;
                               }else {
                                        var json = JSON.parse(body);
                                        console.log(json[0].type);
                                        res.msg = json[0];
                                        res.msg.class="alert-success";
                                        res.msg.title="Success!";
                                        res.msg.msg = "Connected to "+ req.server.name +" "+ json[0].type +" "+ json[0].daemon_type +" Version "+ json[0].version;
				}

                                res.render('servers', { 'msg': res.msg,
                                                        'serverlist': req.serverlist,
                                                        'serverselected': req.server});
                        });
});

router.get('/:id/del', function(req, res) {
  console.log(req.params);
  console.log(req.params.id);
  console.log(req.server);
  console.log(req.db);
/*	else if (req.params.action == "del") {
		console.log("Remove entry in db");
		db.del(req, res, function(req, res) {
			res.redirect('/server');
		});
	}
*/
  res.render('', {});
});

/* -------------------------------------------------*/
/* GET configuration page. */
router.get('/:id/configuration', function(req, res) {
        console.log(req.db);
        console.log(req.params.id);
        console.log(req.server);
        // Redirect to index if missing value
        if (!req.db && !req.server) { res.redirect('/'); } // TODO warm user if missing a DB or a valid server
                        pdnsapi.config.list(req, res, function (error, response, body) {
				// If any error redirect to index
                                if (!body) { console.log(error); res.redirect('/'); }
                                else {
                                        var json = JSON.parse(body);
                                        console.log(json);
                                        res.render('configuration', { 'data': json,
									'serverlist': req.serverlist,
									'navmenu': 'configuration',
									'serverselected': req.server});
                                }
                        });
});

/* -------------------------------------------------*/
/* DOMAINS */

/* GET domains page. */
router.get('/:id/domains', function(req, res) {
        console.log("Get domains");
        console.log(req.db);
        console.log(req.params.id);
        console.log(req.server);
        // If missing value redirect to index or to an error page!!!
        if (!req.db && !req.server) { res.redirect('/'); }
                        pdnsapi.zones.list(req, res, function (error, response, body) {
				// If any error redirect to index
                                if (!body) { console.log(error); res.redirect('/'); }
                                else {
                                        var json = JSON.parse(body);
                                        console.log(json);
                                        res.render('domains', { 'data': json,
								'serverlist': req.serverlist,
								'navmenu': 'domains',
								'serverselected': req.server});
                                }
                        });
});

/* Delete a domain */
router.get('/:id/domains/del/:zone_id', function(req, res) {
        console.log("Delete a domain");
        console.log(req.db);
        console.log(req.params.id);
        console.log(req.params.zone_id);
        // If missing value redirect to index or to an error page!!!
        if (!req.db && !req.server) { res.redirect('/'); }
                        pdnsapi.zones.delete(req, res, function (error, response, body) {
				// If any error redirect to index
                                if (error && response.statusCode != 204) { console.log(error); res.redirect('/servers'); }
                                else {
                                        res.redirect('/servers/'+req.server.id+'/domains');
                                }
                        });
});

/* Add a domain */
router.post('/:id/domains/add', function(req, res) {
        console.log("Add a domain");
        console.log(req.db);
        console.log(req.params.id);
        console.log(req.body.name);
        console.log(req.body.type);
        console.log(req.body.master);
        // If missing value redirect to index or to an error page!!!
        if (!req.db && !req.server) { res.redirect('/'); }
                        pdnsapi.zones.add(req, res, function (error, response, body) {
				// If any error redirect to index
                                if (error && response.statusCode != 204) { console.log(error); res.redirect('/servers'); }
                                else {
                                        res.redirect('/servers/'+req.server.id+'/domains');
                                }
                        });
});

/* Export a domain */
router.get('/:id/domains/export/:zone_id', function(req, res) {
        console.log("Export a domain");
        console.log(req.db);
        console.log(req.params.id);
        console.log(req.params.zone_id);
        // If missing value redirect to index or to an error page!!!
        if (!req.db && !req.server) { res.redirect('/'); }
                        pdnsapi.zones.export(req, res, function (error, response, body) {
				console.log(body);
				// If any error redirect to index
                                if (error && response.statusCode != 200) { console.log(error); res.redirect('/servers'); }
                                else {
                                        res.setHeader('Content-disposition', 'attachment; filename='+req.params.zone_id+'axfr');
                                        res.setHeader('Content-type', 'text/plain');
                                        res.send(body);
                                }
                        });
});


/* -------------------------------------------------*/
/* RECORDS */

/* Get records of a domain */
router.get('/:id/domains/:zone_id', function(req, res) {
        console.log("Get records of a domain");
        console.log(req.db);
        console.log(req.params.id);
        console.log(req.params.zone_id);
        // If missing value redirect to index or to an error page!!!
        if (!req.db && !req.server) { res.redirect('/'); }
                        pdnsapi.records.list(req, res, function (error, response, body) {
				if (error) { console.log("Error:"+ error); }
				console.log(body);
				// If any http error redirect to index
                                if (error && response.statusCode != 200) { console.log(error); res.redirect('/servers'); }
                                else {
					console.log(body);
                                        var json = JSON.parse(body);
                                        console.log(json);
                                        res.render('records', { 'data': json,
								'serverlist': req.serverlist,
								'navmenu': 'domains',
								'serverselected': req.server});
                                }
                        });
});

/* Delete a record */
router.get('/:id/records/del/:zone_id/:record_name/:record_type', function(req, res) {
        console.log("Delete a record");
        console.log(req.db);
        console.log(req.params.id);
        console.log(req.params.zone_id);
        console.log(req.params.record_name);
        console.log(req.params.record_type);
        // If missing value redirect to index or to an error page!!!
        if (!req.db && !req.server) { res.redirect('/'); }
                        var record = { 'name': req.params.record_name, 'type': req.params.record_type };
                        pdnsapi.records.delete(req, res, record, function (error, response, body) {
				// If any http error redirect to index
                                if (error && response.statusCode != 200) { console.log(error); res.redirect('/'); }
                                else {
					// If app error see body.error
					if (body.error) { console.log("Error: " + body.error); }
					res.redirect('/servers/'+ req.params.id +'/domains/'+ req.params.zone_id);
                                }
                        });
});

/* Add/Update a record */
router.post('/:id/records/save/:zone_id', function(req, res) {
        console.log("Add/Update a record");
        console.log(req.db);
        console.log(req.params.id);
        console.log(req.params.zone_id);
        console.log(req.body);
        // If missing value redirect to index or to an error page!!!
        if (!req.db && !req.server) { res.redirect('/'); }
			// TODO Handle priority and disabled correctly
                        var record = { 'name': req.body['name'], 'type': req.body['type'],
					'priority': 0, 'content': req.body['content'],
					'ttl': req.body['ttl'], 'disabled': false };
			console.log(record);
                        pdnsapi.records.update(req, res, record, function (error, response, body) {
				// If any http error redirect to index
                                if (error && response.statusCode != 200) { console.log(error); res.redirect('/'); }
                                else {
					// If app error see body.error
					if (body.error) {
					console.log("Error: " + body.error);
					console.log("Error: connection failed");
                                        res.msg = {};
                                        res.msg.class="alert-warning";
                                        res.msg.title="Error!";
                                        res.msg.msg= "Unable to add/update record. "+ body.error;
                                        res.render('records', { 'msg': res.msg,
                                                                                'serverlist': req.serverlist,
                                                                                'serverselected': req.server});
					}
					res.redirect('/servers/'+ req.params.id +'/domains/'+ req.params.zone_id);
                                }
                        });
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
