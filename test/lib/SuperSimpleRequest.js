/**
 * Imports
 */
require('should');

var _ = require('underscore'),
	http = require('http');

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
		del: function(path, callback) {
			var options = {
				'headers': {
					'Accept': 'application/json'
				}
			};

			request('delete', path, options, callback).end();
		}
	};

	function request(method, path, overrides, callback) {

		var options = build_options(method, path);

		if (_.isFunction(overrides)) {
			callback = overrides;
		} else if (_.isObject(overrides)) {
			_.extend(options, overrides);
		}

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