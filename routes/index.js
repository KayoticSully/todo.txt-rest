'use-strict';

/* GET home page. */

var fs = require('fs')

module.exports = function(app) {
	var files = fs.readdirSync('./routes');

	for (file in files) {
		if (files.hasOwnProperty(file)) {

		}
	}
}

/*
var express = require('express'),
	index = express.Router();

index.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
})
*/