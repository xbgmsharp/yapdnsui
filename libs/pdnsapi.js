var request = require('request');
var db = require('./db.js');

exports.servers = function(req, res, server, callback) {
        if (server.url && server.password) {
                request(
                {
                        dataType: 'json',
                        method: 'GET',
                        url: server.url+"/servers",
                        headers: { "Authorization" : "Basic " + new Buffer("a:" + server.password).toString("base64") }
                },
                function (error, response, body) {
                        callback(req, res, body);
                });
        }
};

exports.config = function(req, res, server, callback){
        if (server.url && server.password) {
                request(
                {
                        dataType: 'json',
                        method: 'GET',
                        url: server.url+"/servers/localhost/config",
                        headers: { "Authorization" : "Basic " + new Buffer("a:" + server.password).toString("base64") }
                },
                function (error, response, body) {
                        callback(req, res, body);
                });
        }
};

exports.zones = function(req, res, server, callback){
        if (server.url && server.password) {
                request(
                {
                        dataType: 'json',
                        method: 'GET',
                        url : server.url+"/servers/localhost/zones",
                        headers: { "Authorization" : "Basic " + new Buffer("a:" + server.password).toString("base64") }
                },
                function (error, response, body) {
                        callback(req, res, server, body);
                });
        }
};

// Handle zone modification
exports.records = function(req, res, server, callback){
        if (server.url && server.password && req.params.zone_id) {
                request(
                {
                        dataType: 'json',
                        method: 'GET',
                        url : server.url+"/servers/localhost/zones/"+req.params.zone_id,
                        headers: { "Authorization" : "Basic " + new Buffer("a:" + server.password).toString("base64") }
                },
                function (error, response, body) {
                        callback(req, res, server, body);
                });
        }
};

exports.statistics = function(req, res, server, callback){
        if (server.url && server.password) {
	        request(
	        {
	                dataType: 'json',
	                method: 'GET',
	                url : server.url+"/servers/localhost/statistics",
        	        headers: { "Authorization" : "Basic " + new Buffer("a:" + server.password).toString("base64") }
	        },
        	function (error, response, body) {
			callback(req, res, server, body);
		});
	}
};
