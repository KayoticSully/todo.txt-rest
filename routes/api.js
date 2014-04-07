'use strict';

/**
 * Module dependencies
 */
var express = require('express');

/**
 * Module Routes
 */
var API = module.exports = express.Router();

var base_route = '/api';
// GET Todo's
API.get(base_route, notImplemented);
// POST Todo's
API.post(base_route, notImplemented);
// PUT Todo's
API.put(base_route, notImplemented);
// DELETE Todo's
API.delete(base_route, notImplemented);

var resource_route = base_route + '/:file';
// GET Todo's
API.get(resource_route, notImplemented);
// POST Todo's
API.post(resource_route, notImplemented);
// PUT Todo's
API.put(resource_route, notImplemented);
// DELETE Todo's
API.delete(resource_route, notImplemented);

var item_route = resource_route + '/:line';
// GET Todo's
API.get(item_route, notImplemented);
// POST Todo's
API.post(item_route, notImplemented);
// PUT Todo's
API.put(item_route, notImplemented);
// DELETE Todo's
API.delete(item_route, notImplemented);

var filter_route = resource_route + '/:filter';
// GET Todo's by filter
API.get(filter_route, notImplemented);

/**
 * Functions
 */
function notImplemented(req, res) {
	res.send({
		'implemented': false
	});
}