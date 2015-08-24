var request = require('request');

/* -------------------------------------------------------- */
/* SEARCH */

exports.search = function(req, res, callback){
        if (req.server.url && req.server.password && req.params.search_term) {
	        request(
	        {
	                dataType: 'json',
	                method: 'GET',
	                url: req.server.url+"/servers/localhost/search-log?q="+req.params.search_term,
			headers: { "X-API-Key" : req.server.password }
	        },
                function (error, response, body) {
			callback(error, response, body);
		});
	}
};
