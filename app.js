var package = require('./package.json');
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Load our routes
// TODO can be improve when undestand
var routes = require('./routes/index');
var about = require('./routes/about');
var configuration = require('./routes/configuration');
var domains = require('./routes/domains');
var records = require('./routes/records');
var statistics = require('./routes/statistics');
var servers = require('./routes/server');

// Load our library
var pdnsapi = require('./libs/pdnsapi');
var database = require('./libs/db');
// Initiliaze the db
var db = database.create();

var app = express();

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
app.use('/configuration', configuration);
app.use('/domains', domains);
app.use('/records', records);
app.use('/statistics', statistics);
app.use('/server', servers);
// Hidden call
app.use('/server/:action', servers);
//app.use('/pdnsapi/:action', pdnsapi);

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
