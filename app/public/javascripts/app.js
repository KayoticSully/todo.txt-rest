var App = Ember.Application.create();

App.Router.map(function() {
	// put your routes here
});

App.IndexRoute = Ember.Route.extend({
	model: function() {
		'use strict';
		return ['red', 'yellow', 'blue'];
	}
});