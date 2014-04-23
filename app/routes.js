'use strict';

var path = require('path'),
    fs = require('fs');

module.exports = function(app, config) {

    // Load route files
    var route_path = path.join(process.cwd(), config.routes);
    var route_files = fs.readdirSync(route_path);

    for (var index in route_files) {
        if (route_files.hasOwnProperty(index)) {
            var file = route_files[index];
            var route = require(path.join(route_path, file));
            app.use('/', route);
        }
    }

    /// catch 404 and forwarding to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res) {
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res) {
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
};