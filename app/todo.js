var exec = require('child_process').exec,
	util = require('util'),
	path = require('path'),
	// Locations
	todo_script = path.join(process.cwd(), 'lib/todo.sh'),
	todo_cfg = path.join(process.cwd(), 'config/todo.cfg'),
	// Settings
	global_args = ['-p', '-d ' + todo_cfg];

/**
 * Runs todo command and logs any errors
 */
function todo(cmd_args, callback) {
	'use strict';

	// standardize input
	if (!util.isArray(cmd_args)) {
		cmd_args = [cmd_args];
	}

	// build final arg list
	var args = global_args.concat(cmd_args).join(' ');
	exec(todo_script + ' ' + args, function(error, stdout) {
		if (error) {
			console.log(error);
			// dont leak error messages
			error = true;
		}

		var line_arr = stdout.trim().split('\n');
		callback(error, line_arr);
	});
}


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

exports.listfrom = function(list_file, query, callback) {
	'use strict';

	list_file = dest_name(list_file);

	var command = 'listfrom ' + list_file + ' ' + query;
	todo(command, function(error, result) {
		// remove extraneous elements
		result.pop();
		result.pop();

		callback(error, result);
	});
};

exports.addto = function(list_file, task, callback) {
	'use strict';

	list_file = dest_name(list_file);

	var command = 'addto ' + list_file + ' ' + task;
	todo(command, function(error, result) {
		callback(error, result[0]);
	});
};

exports.replace = function(list_file, line, task, callback) {
	'use strict';

	list_file = dest_name(list_file);

	var command = 'replacein ' + list_file + ' ' + line + ' ' + task;
	todo(command, function(error, result) {
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