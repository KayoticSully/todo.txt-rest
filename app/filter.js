module.exports = function(req, res, next) {
	'use strict';

	res.render = function(name, payload) {
		res.format({
			/*text: function() {
				//res.send(payload.join('\n'));
				res.send('text/plain not supported');
			},

			html: function() {
				res.send('text/html not supported');
			},
*/
			json: function() {
				var response = {};
				response[name] = payload;
				res.json(response);
			}
		});
	};

	next();
};