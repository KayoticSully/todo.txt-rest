/**
 * Utility Functions
 */

exports.endsWith = endsWith;
exports.dest_name = dest_name;

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