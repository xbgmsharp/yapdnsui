var sqlite3 = require('sqlite3').verbose();
var url = require('url');

// Create internal DB for the server list in memory
exports.create = function(){
	var db = new sqlite3.Database(':memory:');
	// Initiliaze the db
	db.serialize(function() {
		db.run("CREATE TABLE server (id integer primary key asc, name TEXT, url TEXT, password TEXT)");
		//db.run("INSERT INTO server VALUES (?,?,?,?)", [null, 'localhost', 'https://localhost', 'changeme']);
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
	        //req.db.get("INSERT INTO server VALUES (?,?,?,?,?,?,?,?,?,?,?)", [null, obj.host, req.body.url, req.body.password, null,null,null,null,null,null,null],
	        req.db.get("INSERT INTO server VALUES (?,?,?,?)", [null, obj.host, req.body.url, req.body.password],
        	function (err, row) {
			console.log("db.add");
			callback(req, res, err);
        	});
	}
};

exports.update = function(req, res, pdns, callback){
	if (req.db && req.server) {
	        req.db.get("UPDATE server set (?,?,?,?,?,?,?) WHERE id=?", [pdns.type, pdns.id, pdns.url, pdns.daemon_type, pdns.version, pdns.config_url, pdns.zones_url],
        	function (err, row) {
			console.log("db.update");
			callback(err, row);
        	});
	}
};

exports.get = function(req, res, id, callback){
	if (req.db && id) {
	        req.db.get("SELECT * FROM server WHERE id=? LIMIT 1", [id],
	        function (err, row) {
        		if (!row) { callback(req, res, err); }
			else {
				console.log("db.get "+ row.id + " : " + row.name + " : " + row.url + " : " + row.password);
				callback(err, row);
			}
        	});
	}
};

exports.del = function(req, res, callback){
	if (req.db && req.body.id) {
	        req.db.get("DELETE FROM server WHERE id=?)", [req.body.id],
        	function (err, row) {
			callback(req, res, row);
        	});
	}
};
