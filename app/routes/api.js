/**
 * Module dependencies
 */
var _ = require('underscore'),
	express = require('express'),
	path = require('path'),
	todo_util = require(path.join(process.cwd(), 'app/utils.js')),
	todo = require(path.join(process.cwd(), 'app/todo.js')),
	filter = require(path.join(process.cwd(), 'app/filter.js')),
	config = require(path.join(process.cwd(), 'config/app.json'));

// Integrate Unserscore.string
_.str = require('underscore.string');
_.mixin(_.str.exports());
_.str.include('Underscore.string', 'string');

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
API.put(resource_route, replace_file);
// DELETE - Delete :file
API.delete(resource_route, delete_file);

var item_route = resource_route + '/:line';
// GET - Todo Item
API.get(item_route, get_task);
// POST - Do Todo Item
API.post(item_route, do_task);
// PUT - Replace Todo Item
API.put(item_route, update_task);
// DELETE - delete Todo Item
API.delete(item_route, delete_task);

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

function replace_file(req, res) {
	'use strict';

	var file = {
		name: req.params.file,
		replaced: false
	};

	var todos = req.body.todos;
	var filePath = path.join(config.todo_data, todo_util.dest_name(req.params.file));

	todo.replace_file(filePath, todos, function(error, buffer) {
		if (!error) {
			file.contents = buffer;
			file.replaced = true;
		}

		res.render('file', file);
	});
}

function delete_file(req, res) {
	'use strict';

	var file = {
		name: req.params.file,
		deleted: false
	};

	var filePath = path.join(config.todo_data, todo_util.dest_name(req.params.file));

	todo.delete_file(filePath, function(error) {
		if (!error) {
			file.deleted = true;
		}

		res.render('file', file);
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
	todo.list(list_name, '', function(err, response) {
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
		todo.add(list_name, text, function(err, response) {

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
		line = req.params.line,
		new_text = req.body.task;


	var task = {
		updated: false,
		text: new_text
	};

	if (new_text) {
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

function get_task(req, res) {
	'use strict';

	var list_name = req.params.file,
		line = req.params.line;

	var task = {
		text: null
	};

	todo.list(list_name, '', function(error, tasks) {
		if (!error) {
			var filtered_tasks = _.filter(tasks, function(task) {
				return _.startsWith(task, line);
			});

			var selected_task = filtered_tasks[0],
				task_arr = selected_task.split(' ');

			task.line_number = parseInt(task_arr.shift());
			task.text = task_arr.join(' ');
		}

		res.render('task', task);
	});
}

function do_task(req, res) {
	'use strict';

	var list_name = req.params.file,
		line = req.params.line;

	var task = {
		text: null
	};

	todo.complete(list_name, line, function(error, result) {
		if (!error) {
			var task_arr = result.split(' ');

			task.line_number = parseInt(task_arr.shift());
			task.text = task_arr.join(' ');
		}

		res.render('task', task);
	});
}

function delete_task(req, res) {
	'use strict';

	var list_name = req.params.file,
		line = req.params.line;

	var task = {
		text: null,
		deleted: false
	};

	todo.del(list_name, line, function(error, result) {
		if (!error) {
			var task_arr = result.split(' ');

			task.line_number = parseInt(task_arr.shift());
			task.text = task_arr.join(' ');
			task.deleted = true;
		}

		res.render('task', task);
	});
}