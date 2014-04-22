/// Module dependencies.
var express = require('express'),
    favicon = require('static-favicon'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    config = require(path.join(process.cwd(), 'config/app.json')),
    routes = require(path.join(process.cwd(), 'routes.js'));

/**
 * app variables
 */
var app = module.exports = express();

// Logger
if ('development' === app.settings.env || 'test' === app.settings.env) {
    app.use(logger('dev'));
} else {
    app.use(logger('default'));
}

// view engine setup
app.use(favicon());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Load Routes
 */
routes(app, config);

/**
 * Start App
 */
if (!module.parent) {
    // kick off the server!
    app.listen(app.get('port'), function() {
        'use strict';
        console.log('Express server listening on port ' + app.get('port'));
    });
}