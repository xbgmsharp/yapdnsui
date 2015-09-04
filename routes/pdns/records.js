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
/* RECORDS */

/* Get records of a domain */
router.get('/servers/:id/domains/:zone_id', function(req, res) {
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
router.get('/servers/:id/records/del/:zone_id/:record_name/:record_type', function(req, res) {
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
router.post('/servers/:id/records/save/:zone_id', function(req, res) {
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

module.exports = router;
