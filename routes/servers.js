var express = require('express');
var database = require('../libs/db');
var pdnsapi = require('../libs/pdnsapi');
var router = express.Router();

// Route middleware to validate :id
// Execute for all request
// It return the full server object from the DB
router.param('id', function(req, res, next, id){
	console.log("server_id: [%s]", id);
	console.log(parseInt(id));
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

/* GET servers page, when no servers in the list */
router.get('/', function(req, res) {
	if (!req.db) { res.redirect('/'); }
	database.list(req, res, function(req, res, rows) {
		res.render('servers', { 'serverlist': rows, 'navmenu': '' });
	});
});

/* POST to add server Service */
router.post('/add', function(req, res) {
	console.log("Server add");
        console.log(req.db);
        console.log(req.body);
        // Redirect to index if missing value from the form
        //if (!req.db || !req.body.url || !req.body.password) { res.redirect('/servers'); }
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
	if (!req.db || !req.server || !req.params.id) { res.redirect('/'); }
	pdnsapi.config.servers(req, res, function (error, response, body) {
   			var json = JSON.parse(body);
                              database.refresh(req, res, json[0], function(req, res) {
				console.log("db refresh");
			      });                                          
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
  console.log("Server delete");
  console.log(req.params);
  console.log(req.server);
  console.log(req.db);
  if (!req.db || !req.params.id) { res.redirect('/servers'); }
  database.delete(req, res, function(req, res, rows) {
	res.redirect('/servers');
  });
});

router.post('/:id/update', function(req, res) {
  console.log("Server update");
  console.log(req.params);
  console.log(req.server);
  console.log(req.db);
  if (!req.db || !req.params.id) { res.redirect('/servers'); }
  database.update(req, res, function(req, res, rows) {
	res.redirect('/servers');
  });
});

router.get('/:id/refresh', function(req, res) {
  console.log("Server refresh");
  console.log(req.params);
  console.log(req.server);
  console.log(req.db);
  if (!req.db || !req.params.id) { res.redirect('/servers'); }
  pdnsapi.config.servers(req, res, function (error, response, body) {
	var json = JSON.parse(body);
  	database.refresh(req, res, json[0], function(req, res, rows) {
		res.redirect('/servers');
	});
  });
});

module.exports = router;
