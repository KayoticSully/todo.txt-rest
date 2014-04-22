'use strict';
/**
 * Module dependencies
 */
var express = require('express');

/**
 * Module Routes
 */
var Index = module.exports = express.Router();

var base_route = '/';
// GET Web
Index.get(base_route, home);

/**
 * Functions
 */
function home(req, res) {
	res.sendfile('views/index.html');
}