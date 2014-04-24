var _ = require('underscore'),
	exec = require('child_process').exec,
	util = require('util'),
	path = require('path'),
	app_config = require(path.join(process.cwd(), 'config/app.json')),
	// Locations
	todo_script = path.join(process.cwd(), 'lib/todo.sh'),
	todo_cfg = path.join(process.cwd(), 'config/todo.cfg'),
	// Settings
	global_args = ['-p', '-d ' + todo_cfg];

/**
 * Variable Setup
 */
var options = {
	env: {
		TODO_DIR: app_config.todo_data,
		TODO_FILE: path.join(app_config.todo_data, 'todo.txt')
	}
};

/**
 * Runs todo command and logs any errors
 */
function todo(cmd_args, settings, callback) {
	'use strict';

	var script_options = _.clone(options);

	// Apply settings
	if (_.isFunction(settings)) {
		callback = settings;
	} else if (_.isObject(options)) {
		if (settings.TODO_DIR) {
			script_options.env.TODO_DIR = settings.TODO_DIR;
		}

		if (settings.TODO_FILE) {
			script_options.env.TODO_FILE = path.join(script_options.env.TODO_DIR, settings.TODO_FILE);
		}
	}

	// standardize input
	if (!util.isArray(cmd_args)) {
		cmd_args = [cmd_args];
	}

	// build final arg list
	var args = global_args.concat(cmd_args).join(' ');
	exec(todo_script + ' ' + args, script_options, function(error, stdout) {
		if (error) {
			console.log(error);
			// dont leak error messages
			error = true;
		}

		var line_arr = stdout.trim().split('\n');
		callback(error, line_arr);
	});
}

/**
 * Todo Actions
 */
exports.listfile = function(callback) {
	'use strict';

	todo('listfile', function(error, result) {
		result.splice(0, 1);

		callback(error, result);
	});
};

exports.make = function(file_name, callback) {
	'use strict';

	var suffix = '.txt';
	if (file_name && endsWith(file_name, suffix)) {
		var arr = file_name.split('.');
		arr.pop();
		file_name = arr.join('.');
	}

	todo('make ' + file_name, function(error, result) {
		callback(error, result[0]);
	});
};

exports.list = function(list_file, query, callback) {
	'use strict';

	var options = {
		TODO_FILE: dest_name(list_file)
	};

	var command = 'list ' + query;
	todo(command, options, function(error, result) {
		// remove extraneous elements
		result.pop();
		result.pop();

		callback(error, result);
	});
};

exports.add = function(list_file, task, callback) {
	'use strict';

	var options = {
		TODO_FILE: dest_name(list_file)
	};

	var command = 'add ' + task;
	todo(command, options, function(error, result) {
		callback(error, result[0]);
	});
};

exports.replace = function(list_file, line, task, callback) {
	'use strict';

	var options = {
		TODO_FILE: dest_name(list_file)
	};

	var command = 'replace ' + line + ' ' + task;
	todo(command, options, function(error, result) {
		callback(error, result);
	});
};

/**
 * Utility Functions
 */
function endsWith(str, suffix) {
	'use strict';
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function dest_name(dest) {
	'use strict';

	var suffix = '.txt';

	if (dest && !endsWith(dest, suffix)) {
		dest += suffix;
	}

	return dest;
}