var request = require('request');

/* --------------------------------------------------------
*
* ZONES / DOMAINS 
* https://doc.powerdns.com/md/httpapi/api_spec/
*
*/

// Handle Zones listing
exports.list= function(req, res, callback){
        if (req.server.url && req.server.password) {
                request(
                {
                        dataType: 'json',
                        method: 'GET',
                        url: req.server.url+"/servers/localhost/zones",
			headers: { "X-API-Key" : req.server.password }
                },
                function (error, response, body) {
                        callback(error, response, body);
                });
        }
};

// Handle Zones delete
exports.delete = function(req, res, callback){
        if (req.server.url && req.server.password && req.params.zone_id) {
                request(
                {
                        dataType: 'json',
                        method: 'DELETE',
                        url: req.server.url+"/servers/localhost/zones/"+req.params.zone_id,
                        json: { "rrsets": [ { "name": req.params.zone_id, "changetype": "DELETE", "records": [] , "comments": [] } ] },
			headers: { "X-API-Key" : req.server.password }
                },
                function (error, response, body) {
                        callback(error, response, body);
                });
        }
};

// Handle Zones add/update
exports.add = function(req, res, callback){
        if (req.server.url && req.server.password && req.body.name && req.body.type) {
                request(
                {
                        dataType: 'json',
                        method: 'POST',
                        url: req.server.url+"/servers/localhost/zones",
                        json: { "kind": req.body.type, "name": req.body.name, "masters": [req.body.master], "nameservers": [], "records": []},
			headers: { "X-API-Key" : req.server.password }
                },
                function (error, response, body) {
                        callback(error, response, body);
                });
        }
};

// Handle Zones import
exports.import = function(req, res, callback){
        if (req.server.url && req.server.password && req.params.zone_id && req.body.zone) {
                request(
                {
                        dataType: 'json',
                        method: 'PUT',
                        url: req.server.url+"/servers/localhost/zones/"+req.params.zone_id+"/import",
                        json: { "zone": req.body.zone},
                        headers: { "X-API-Key" : req.server.password }
                },
                function (error, response, body) {
                        callback(error, response, body);
                });
        }
};

// Handle Zones export
exports.export = function(req, res, callback){
        if (req.server.url && req.server.password && req.params.zone_id) {
                request(
                {
                        dataType: 'json',
                        method: 'GET',
                        url: req.server.url+"/servers/localhost/zones/"+req.params.zone_id+"/export",
                        headers: { "X-API-Key" : req.server.password }
                },
                function (error, response, body) {
                        callback(error, response, body);
                });
        }
};

// Handle Zone notify
exports.notify = function(req, res, callback){
        if (req.server.url && req.server.password && req.params.zone_id) {
                request(
                {
                        dataType: 'json',
                        method: 'PUT',
                        url: req.server.url+"/servers/localhost/zones/"+req.params.zone_id+"/notify",
                        headers: { "X-API-Key" : req.server.password }
                },
                function (error, response, body) {
                        callback(error, response, body);
                });
        }
};

// Handle Zone axfr-retrieve
exports.retrieve = function(req, res, callback){
        if (req.server.url && req.server.password && req.params.zone_id) {
                request(
                {
                        dataType: 'json',
                        method: 'PUT',
                        url: req.server.url+"/servers/localhost/zones/"+req.params.zone_id+"/axfr-retrieve",
                        headers: { "X-API-Key" : req.server.password }
                },
                function (error, response, body) {
                        callback(error, response, body);
                });
        }
};

// Handle Zone check - Not yet implemented.
exports.check = function(req, res, callback){
        if (req.server.url && req.server.password && req.params.zone_id) {
                request(
                {
                        dataType: 'json',
                        method: 'PUT',
                        url: req.server.url+"/servers/localhost/zones/"+req.params.zone_id+"/check",
                        headers: { "X-API-Key" : req.server.password }
                },
                function (error, response, body) {
                        callback(error, response, body);
                });
        }
};
