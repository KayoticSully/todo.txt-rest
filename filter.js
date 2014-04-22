module.exports = function(req, res, next) {
	'use strict';

	res.render = function(payload) {

		res.format({
			text: function() {
				res.send(payload.join('\n'));
			},

			html: function() {
				res.send(payload.join('<br />'));
			},

			json: function() {
				res.json(payload);
			}
		});
	};

	next();
};