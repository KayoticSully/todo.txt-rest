var _ = require('underscore'),
	exec = require('child_process').exec,
	util = require('util'),
	path = require('path'),
	fs = require('fs'),
	todo_util = require(path.join(process.cwd(), 'app/utils.js')),
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
function todo(cmd_args, settings, autoYes, callback) {
	'use strict';

	var script_options = _.clone(options);

	// Apply settings
	if (_.isFunction(autoYes)) {
		callback = autoYes;
	} else if (_.isFunction(settings)) {
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

	var pipe = '';
	if (autoYes) {
		pipe = 'echo y | ';
	}

	exec(pipe + todo_script + ' ' + args, script_options, function(error, stdout) {
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
	if (file_name && todo_util.endsWith(file_name, suffix)) {
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
		TODO_FILE: todo_util.dest_name(list_file)
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
		TODO_FILE: todo_util.dest_name(list_file)
	};

	var command = 'add ' + task;
	todo(command, options, function(error, result) {
		callback(error, result[0]);
	});
};

exports.replace = function(list_file, line, task, callback) {
	'use strict';

	var options = {
		TODO_FILE: todo_util.dest_name(list_file)
	};

	var command = 'replace ' + line + ' ' + task;
	todo(command, options, function(error, result) {
		callback(error, result);
	});
};

exports.replace_file = function(path, task_array, callback) {
	'use strict';

	fs.exists(path, function(exists) {
		if (exists) {
			// remove file
			fs.unlinkSync(path);

			var buffer = '';
			for (var i in task_array) {
				if (!_.isNaN(i)) {
					buffer += task_array[i] + '\n';
				}
			}

			fs.writeFile(path, buffer, function(error) {
				callback(error, buffer);
			});
		} else {
			callback('file does not exist', null);
		}
	});
};

exports.delete_file = function(path, callback) {
	'use strict';
	fs.exists(path, function(exists) {
		if (exists) {
			// remove file
			fs.unlink(path, function(error) {
				callback(error);
			});
		} else {
			callback('file does not exist');
		}
	});
};

exports.complete = function(list_file, line_number, callback) {
	'use strict';

	var options = {
		TODO_FILE: todo_util.dest_name(list_file)
	};

	var command = 'do ' + line_number;
	todo(command, options, function(error, result) {
		callback(error, result[0]);
	});
};

exports.del = function(list_file, line_number, callback) {
	'use strict';

	var options = {
		TODO_FILE: todo_util.dest_name(list_file)
	};

	var command = 'del ' + line_number;
	todo(command, options, true, function(error, result) {
		callback(error, result[1]);
	});
};