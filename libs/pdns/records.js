var request = require('request');

/* --------------------------------------------------------
*
* RECORDS
* https://doc.powerdns.com/md/httpapi/api_spec/
*
*/

// Handle records listing
exports.list = function(req, res, callback){
        if (req.server.url && req.server.password && req.params.zone_id) {
                request(
                {
                        dataType: 'json',
                        method: 'GET',
                        url: req.server.url+"/servers/localhost/zones/"+req.params.zone_id,
			headers: { "X-API-Key" : req.server.password }
                },
                function (error, response, body) {
                        callback(error, response, body);
                });
        }
};

// Handle records delete
exports.delete = function(req, res, record, callback){
        if (req.server.url && req.server.password && req.params.zone_id && record) {
                request(
                {
                        dataType: 'json',
                        method: 'PATCH',
                        url: req.server.url+"/servers/localhost/zones/"+req.params.zone_id,
                        json: { "rrsets": [ { "name": record.name, "type": record.type, "changetype": "DELETE", "records": [ ] } ] },
			headers: { "X-API-Key" : req.server.password, 
				   "Content-Type": "application/json" }
                },
                function (error, response, body) {
                        callback(error, response, body);
                });
        }
};

// Handle records update/add
exports.add = function(req, res, record, callback){
        if (req.server.url && req.server.password && req.params.zone_id && record) {
		json= { "rrsets": [ { "name": record.name, "type": record.type, "changetype": "REPLACE", "records": [ record ] } ] }
		console.log(json);
                request(
                {
                        dataType: 'json',
                        method: 'PATCH',
                        url: req.server.url+"/servers/localhost/zones/"+req.params.zone_id,
                        json: { "rrsets": [ { "name": record.name, "type": record.type, "changetype": "REPLACE", "records": [ record ] } ] },
			headers: { "X-API-Key" : req.server.password, 
				   "Content-Type": "application/json" }
                },
                function (error, response, body) {
                        callback(error, response, body);
                });
        }
};

