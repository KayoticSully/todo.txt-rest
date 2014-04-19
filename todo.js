'use strict';

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

		callback(error, stdout);
	});
}


exports.list_files = function(callback) {
	todo('listfile', function(error, result) {
		var line_arr = result.trim().split('\n');
		line_arr.splice(0, 1);
		callback(error, line_arr);
	});
};

exports.add = function(task, callback) {
	todo('add ' + task, function(error, result) {
		callback(error, result);
	});
};