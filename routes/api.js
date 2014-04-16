'use strict';

/**
 * Module dependencies
 */
var express = require('express'),
	exec = require('child_process').exec;

/**
 * Module Routes
 */
var API = module.exports = express.Router();

var base_route = '/api';
// GET - List Todo Files
API.get(base_route, ListTodoFiles);
// POST - Create Todo File
API.post(base_route, notImplemented);
// PUT - Replace All Todo Files
API.put(base_route, notImplemented);
// DELETE Delete All Todo Files
API.delete(base_route, notImplemented);

var resource_route = base_route + '/:file';
// GET - List Tasks in :file
API.get(resource_route, notImplemented);
// POST - Add Task in :file
API.post(resource_route, notImplemented);
// PUT - Replace :file
API.put(resource_route, notImplemented);
// DELETE - Delete :file
API.delete(resource_route, notImplemented);

var item_route = resource_route + '/:line';
// GET - Todo Item
API.get(item_route, notImplemented);
// POST - Do Todo Item
API.post(item_route, notImplemented);
// PUT - Replace Todo Item
API.put(item_route, notImplemented);
// DELETE - delete Todo Item
API.delete(item_route, notImplemented);

var filter_route = resource_route + '/:filter';
// GET - Todo Items limited by :filter
API.get(filter_route, notImplemented);

/**
 * Functions
 */
function notImplemented(req, res) {
	res.send({
		'implemented': false
	});
}

function ListTodoFiles(req, res) {
	exec('todo.sh -p listfile', function(error, stdout, stderr) {
		res.send('<pre>' + stdout + '</pre>');
	});
}