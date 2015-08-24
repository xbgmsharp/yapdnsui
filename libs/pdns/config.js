var request = require('request');

// Handle servers description
exports.servers = function(req, res, callback) {
        if (req.server.url && req.server.password) {
                request(
                {
                        dataType: 'json',
                        method: 'GET',
                        url: req.server.url+"/servers",
			headers: { "X-API-Key" : req.server.password }
                },
                function (error, response, body) {
                        callback(error, response, body);
                });
        }
};

// Handle configuration listing
exports.list = function(req, res, callback){
        if (req.server.url && req.server.password) {
                request(
                {
                        dataType: 'json',
                        method: 'GET',
                        url: req.server.url+"/servers/localhost/config",
			headers: { "X-API-Key" : req.server.password }
                },
                function (error, response, body) {
                        callback(error, response, body);
                });
        }
};
