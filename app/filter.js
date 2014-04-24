module.exports = function(req, res, next) {
	'use strict';

	res.render = function(name, payload) {

		res.format({
			text: function() {
				res.send(payload.join('\n'));
			},

			html: function() {
				res.send(payload.join('<br />'));
			},

			json: function() {
				var response = {};
				response[name] = payload;
				res.json(response);
			}
		});
	};

	next();
};