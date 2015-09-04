var fs = require('fs');
var file = 'yapdnsui.sqlite3';
var exists = fs.existsSync(file);

var sqlite3 = require('sqlite3').verbose();
var url = require('url');

if (!exists){
	console.log("Creating DB File");
	fs.openSync(file, "w");
}

// Create internal DB for the server list in memory
exports.create = function(){
	var db = new sqlite3.Database(file);
	// Initiliaze the db
	db.serialize(function() {
		if (!exists) {
			db.run("CREATE TABLE servers (id integer primary key asc, name TEXT, url TEXT, password TEXT, pdns_type TEXT, pdns_id TEXT, pdns_url TEXT, pdns_daemon_type TEXT, pdns_version TEXT, pdns_config_url TEXT, pdns_zones_url TEXT)");
			db.run("INSERT INTO servers VALUES (?,?,?,?,?,?,?,?,?,?,?)", [null, 'localhost', 'https://localhost:8053', 'changeme', null,null,null,null,null,null,null]);
			db.each("SELECT * FROM servers", function(err, row) {
				console.log("init db.js "+ row);
			});
		}
	});
	return db;
};

exports.list = function(req, res, callback){
	if (req.db) {
	        req.db.all("SELECT * FROM servers",
	        function (err, rows) {
			console.log("db.list "+ JSON.stringify(rows));
			callback(req, res, rows);
		});
	}
};

exports.add = function(req, res, callback){
	if (req.db && req.body.url && req.body.password) {
		var obj = url.parse(req.body.url);
	        req.db.get("INSERT INTO servers VALUES (?,?,?,?,?,?,?,?,?,?,?)", [null, obj.host, req.body.url, req.body.password, null,null,null,null,null,null,null],
        	function (err, row) {
			console.log("db.add");
			callback(req, res, err);
		});
	}
};

exports.update = function(req, res, callback){
	if (req.db && req.params.id && req.body.url && req.body.password) {
                var obj = url.parse(req.body.url);
	        req.db.run("UPDATE servers SET name=?,url=?,password=? WHERE id=?", [obj.host, req.body.url, req.body.password, req.params.id],
		function (err, row) {
			console.log("db.update "+ this);
			callback(req, res, row);
        	});
	}
};


exports.refresh = function(req, res, pdns, callback){
	if (req.db && req.params.id && pdns) {
	        req.db.run("UPDATE servers SET pdns_type=?, pdns_id=?, pdns_url=?, pdns_daemon_type=?, pdns_version=?, pdns_config_url=?, pdns_zones_url=? WHERE id=?", [pdns.type, pdns.id, pdns.url, pdns.daemon_type, pdns.version, pdns.config_url, pdns.zones_url, req.params.id],
		function (err, row) {
			console.log("db.refresh"+ this);
			callback(req, res, row);
        	});
	}
};

exports.get = function(req, res, id, callback){
	if (req.db && id) {
	        req.db.get("SELECT * FROM servers WHERE id=? LIMIT 1", [id],
	        function (err, row) {
        		if (!row) { callback(req, res, err); }
			else {
				console.log("db.get "+ row);
				callback(err, row);
			}
        	});
	}
};

exports.delete = function(req, res, callback){
	if (req.db && req.params.id) {
		req.db.run("DELETE FROM servers WHERE id=?", [req.params.id],
		function (err, row) {
			console.log("db.del:" + err);
			callback(req, res, row);
		});
	}
};
