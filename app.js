var package = require('./package.json');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Load our routes
var index = require('./routes/index');
var about = require('./routes/about');
var pdns = require('./routes/pdns');

// Load our DB library
var database = require('./libs/db');
// Initiliaze the db
var db = database.create();
// Initiliaze the app
var app = express();

// Make our db is accessible to our router
// Will be execute for all events
app.use(function(req,res,next){
    req.db = db;
    next();
});

// Set global package.json details for use in the webgui
app.set('package', package);
app.set('title', 'Yet Another PDNS UI');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// Add my own public content
app.use(express.static(path.join(__dirname, 'public')));
// Add vendor content from bower
app.use(express.static(path.join(__dirname, 'bower_components')));

// Route the page
app.use('/', index);
app.use('/about', about);
app.use('/servers', pdns);

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
