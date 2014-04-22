/**
 * Module dependencies
 */
var express = require('express'),
	path = require('path'),
	todo = require(path.join(process.cwd(), 'todo.js')),
	filter = require(path.join(process.cwd(), 'filter.js'));

/**
 * Module Routes
 */
var API = module.exports = express.Router();

API.use(filter);

var base_route = '/api';
// GET - List Todo Files
API.get(base_route, list_todo_files);
// POST - Create Todo File
API.post(base_route, create_todo_file);
// PUT - Replace All Todo Files
API.put(base_route, not_implemented);
// DELETE Delete All Todo Files
API.delete(base_route, not_implemented);

var resource_route = base_route + '/:file';
// GET - List Tasks in :file
API.get(resource_route, list_tasks); // NEXT
// POST - Add Task in :file
API.post(resource_route, not_implemented);
// PUT - Replace :file
API.put(resource_route, not_implemented);
// DELETE - Delete :file
API.delete(resource_route, not_implemented);

var item_route = resource_route + '/:line';
// GET - Todo Item
API.get(item_route, not_implemented);
// POST - Do Todo Item
API.post(item_route, not_implemented);
// PUT - Replace Todo Item
API.put(item_route, not_implemented);
// DELETE - delete Todo Item
API.delete(item_route, not_implemented);

var filter_route = resource_route + '/:filter';
// GET - Todo Items limited by :filter
API.get(filter_route, not_implemented);

/**
 * Functions
 */
function not_implemented(req, res) {
	'use strict';

	res.render({
		'implemented': false
	});
}

function list_todo_files(req, res) {
	'use strict';

	todo.listfile(function(err, response) {
		res.render(response);
	});
}

function create_todo_file(req, res) {
	'use strict';

	var file_name = req.body.file_name;

	todo.make(file_name, function(err, response) {
		res.render(response);
	});
}

function list_tasks(req, res) {
	'use strict';

	var list_name = req.params.file;
	todo.list(list_name, '', function(err, response) {
		res.render(response);
	});
}