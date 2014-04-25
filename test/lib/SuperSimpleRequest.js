/**
 * Imports
 */
require('should');

var _ = require('underscore'),
	http = require('http'),
	fs = require('fs');

module.exports = function(config) {
	'use strict';

	return {
		get: function(path, callback) {
			request('get', path, callback).end();
		},
		post: function(path, payload, callback) {
			var req = request('post', path, callback);

			var body = JSON.stringify(payload);
			req.write(body);
			req.end();
		},
		put: function(path, payload, callback) {
			var req = request('put', path, callback);

			var body = JSON.stringify(payload);
			req.write(body);
			req.end();
		},
		putFile: function(path, filePath, callback) {
			var req = request('putfile', path, callback);

			var stream = fs.createReadStream(filePath);
			stream.pipe(req);

			req.end();
		}
	};

	function request(method, path, callback) {

		var options = build_options(method, path);

		return http.request(options, function(response) {
			var body = '';

			response.should.be.json;
			response.on('data', storeData).on('end', done);

			function storeData(chunk) {
				body += chunk;
			}

			function done() {
				var payload = JSON.parse(body);
				callback(undefined, payload, response);
			}
		}).on('error', function(error) {
			callback(error, undefined, undefined);
		});
	}

	function build_options(method, path) {
		var options = _.clone(config);

		options.path = path;
		options.method = method;

		return options;
	}
};