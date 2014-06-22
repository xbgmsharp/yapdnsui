var request = require('request');
var db = require('./db.js');

exports.config = function(req, res){
        console.log(req.db);
	// Redirect to index if missing value
	if (!req.db || !req.query.server) { res.redirect('/'); }
	// Get server from DB
        db.get(req, res, function(req, res, row) {
		if (!row){ res.redirect('/'); }
		else {
		request(
		{
			dataType: 'json',
			method: 'GET',
			url: row.url+"/servers/localhost/config",
			headers: { "Authorization" : "Basic " + new Buffer("a:" + row.password).toString("base64") }
		},
		function (error, response, body) {
		        // Do more stuff with 'body' here
			console.log(error);
		        var json = JSON.parse(body);
		        //console.log(json);
			db.list(req, res, json, function(req, res, json, rows) {
				var obj = {};
				obj.name = req.query.server; // Avoid doing a nsecond DB query
				res.render('configuration', { 'data': json, 'serverlist': rows, 'navmenu': 'configuration', 'serverselected': obj});
			});
		});
		}
	});
};

exports.zones = function(req, res){
	console.log(req.db);
	// Redirect to index if missing value
	if (!req.db || !req.query.server) { res.redirect('/'); }
	// Do the job
	db.get(req, res, function(req, res, row) {
		if (!row){ res.redirect('/'); }
		else {
		request(
		{
			dataType: 'json',
			method: 'GET',
			url : row.url+"/servers/localhost/zones",
			headers: { "Authorization" : "Basic " + new Buffer("a:" + row.password).toString("base64") }
		},
		function (error, response, body) {
        		// Do more stuff with 'body' here
	        	var json = JSON.parse(body);
			console.log(json);
			db.list(req, res, json, function(req, res, json, rows) {
				var obj = {};
				obj.name = req.query.server; // Avoid doing a nsecond DB query
			        res.render('domains', { 'data': json, 'serverlist': rows, 'navmenu': 'domains', 'serverselected': obj});
			});
		});
		}
	});
};

exports.statistics = function(req, res){
	console.log(req.db);
	// Redirect to index if missing value
	if (!req.db || !req.query.server) { res.redirect('/'); }
	db.get(req, res, function(req, res, row) {
		if (!row){ res.send('Enable to find server details', {'Content-type': 'text/json'}, 200); }
		else {
		request(
		{
			dataType: 'json',
			method: 'GET',
			url : row.url+"/servers/localhost/statistics",
			headers: { "Authorization" : "Basic " + new Buffer("a:" + row.password).toString("base64") }
		},
		function (error, response, body) {
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
		});
		}
	});
};

