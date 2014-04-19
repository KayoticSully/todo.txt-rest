'use strict';


var MimeTypes = {
	json: /application\/json/,
	html: /text\/html/,
	txt: /text\/plain/
};


exports.json = function(req, res, next) {

	if (MimeTypes.json.test(req.headers.accept) || req.params.format === 'json') {
		req.is_json = true;
		res.render = render_json;
	} else {
		req.is_json = false;
	}

	next();
};

exports.txt = function(req, res, next) {

	if (MimeTypes.txt.test(req.headers.accept) || req.params.format === 'txt') {
		req.is_txt = true;
		res.render = render_txt;
	} else {
		req.is_txt = false;
	}

	next();
};

exports.html = function(req, res, next) {
	next();
};

function render_json(payload) {
	this.json(payload);
}

function render_txt(payload) {
	this.send(payload.join('\n'));
}