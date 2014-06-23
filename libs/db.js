var sqlite3 = require('sqlite3').verbose();
var url = require('url');

// Create internal DB for the server list in memory
exports.create = function(){
	var db = new sqlite3.Database(':memory:');
	// Initiliaze the db
	db.serialize(function() {
		db.run("CREATE TABLE server (id integer primary key asc, name TEXT, url TEXT, password TEXT)");
		db.run("INSERT INTO server VALUES (?,?,?,?)", [null, 'localhost', 'http://localhost:8053', 'changeme']);
		db.each("SELECT * FROM server", function(err, row) {
			console.log("init db.js "+ row.id + " : " + row.name + " : " + row.url + " : " + row.password);
		});
	});
	return db;
};

exports.list = function(req, res, json, callback){
	if (req.db) {
	        req.db.all("SELECT * FROM server",
	        function (err, rows) {
			console.log("db.list "+ JSON.stringify(rows));
			callback(req, res, json, rows);
	        });
	}
};

exports.add = function(req, res, callback){
	if (req.db && req.body.url && req.body.password) {
		var obj = url.parse(req.body.url);
	        req.db.get("INSERT INTO server VALUES (?,?,?,?)", [null, obj.host, req.body.url, req.body.password],
        	function (err, row) {
			callback(req, res, row);
        	});
	}
};

exports.get = function(req, res, callback){
	if (req.db && req.query.server) {
		console.log(req.query.server);
	        req.db.get("SELECT * FROM server WHERE name=? LIMIT 1", [req.query.server],
	        function (err, row) {
	        	if (!row) { callback(req, res, err); }
			else {
				console.log("db.get "+ row.id + " : " + row.name + " : " + row.url + " : " + row.password);
				callback(req, res, row);
			}
        	});
	}
};
