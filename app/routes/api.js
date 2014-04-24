/**
 * Module dependencies
 */
var express = require('express'),
	path = require('path'),
	todo = require(path.join(process.cwd(), 'app/todo.js')),
	filter = require(path.join(process.cwd(), 'app/filter.js'));

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
API.get(resource_route, list_tasks);
// POST - Add Task in :file
API.post(resource_route, create_task);
// PUT - Replace :file
API.put(resource_route, update_task);
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

	res.render('nope', {
		'implemented': false
	});
}

function list_todo_files(req, res) {
	'use strict';

	todo.listfile(function(err, response) {
		res.render('files', response);
	});
}

function create_todo_file(req, res) {
	'use strict';

	var file_name = req.body.file_name;

	var file = {
		created: false,
		exists: false,
		name: file_name
	};

	if (file_name) {
		todo.make(file_name, function(err, response) {
			var success = response &&
				response.indexOf(file_name) > -1 &&
				response.indexOf('created') > -1;

			if (success) {
				file.created = true;
			} else {
				file.exists = true;
			}

			res.render('file', file);
		});
	} else {
		res.render('file', file);
	}
}

function list_tasks(req, res) {
	'use strict';

	// no validation needed for file route would
	// not get here if it did not exist
	var list_name = req.params.file;
	todo.listfrom(list_name, '', function(err, response) {
		res.render('tasks', response);
	});
}

function create_task(req, res) {
	'use strict';

	var list_name = req.params.file;
	var text = req.body.task;

	var task = {
		created: false,
		text: text
	};

	if (text) {
		todo.addto(list_name, text, function(err, response) {

			var task_arr = response.split(' '),
				line_number = task_arr[0];

			task.created = true;
			task.line_number = parseInt(line_number);

			res.render('task', task);
		});
	} else {
		res.render('task', task);
	}
}


function update_task(req, res) {
	'use strict';

	var list_name = req.params.file,
		new_text = req.body.task,
		line = req.body.line_number;


	var task = {
		updated: false,
		line_number: line,
		text: new_text
	};

	if (new_text && line) {
		todo.replace(list_name, line, new_text, function(err, response) {
			var old_text_arr = response[0].split(' ');

			old_text_arr.shift();
			var old_text = old_text_arr.join(' ');

			task.updated = true;
			task.old_text = old_text;

			res.render('task', task);
		});
	} else {
		res.render('task', task);
	}
}