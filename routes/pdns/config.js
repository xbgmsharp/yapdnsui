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
/* GET configuration page. */
router.get('/servers/:id/configuration', function(req, res) {
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

module.exports = router;
