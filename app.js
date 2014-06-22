var package = require('./package.json');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var about = require('./routes/about');
var statistics = require('./routes/statistics');
var servers = require('./routes/server');
var pdnsapi = require('./routes/pdnsapi');

var app = express();
// sets port 8080 to default or unless otherwise specified in the environment
app.set('port', process.env.PORT || 8080);

// Allow self sign SSL Certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

// Create internal DB for the server list in memory
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

// Initiliaze the db
db.serialize(function() {
  db.run("CREATE TABLE server (id integer primary key asc, name TEXT, url TEXT, password TEXT)");
  if (app.get('env') === 'development') {
	db.run("INSERT INTO server VALUES (?,?,?,?)", [null, 'localhost', 'http://localhost:8053', 'changeme']);
	db.each("SELECT * FROM server", function(err, row) {
	      console.log("first run "+ row.id + " : " + row.name + " : " + row.url + " : " + row.password);
	});
  }
});

// Make our db is accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

// Set global package.json details
app.set('package', package);
app.set('title', 'Yet Another PDNS UI');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/about', about);
app.use('/configuration', pdnsapi.config);
app.use('/domains', pdnsapi.zones);
app.use('/statistics', statistics);
app.use('/pdnsapi/statistics', pdnsapi.statistics);
app.use('/server', servers);
app.use('/server/:action', servers);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
