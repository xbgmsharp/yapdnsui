var request = require('request');

/* -------------------------------------------------------- */
/* STATISTICS */
exports.statistics = function(req, res, callback){
        if (req.server.url && req.server.password) {
	        request(
	        {
	                dataType: 'json',
	                method: 'GET',
	                url: req.server.url+"/servers/localhost/statistics",
			headers: { "X-API-Key" : req.server.password }
	        },
                function (error, response, body) {
			callback(error, response, body);
		});
	}
};
