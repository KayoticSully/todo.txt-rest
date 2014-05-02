var App = Ember.Application.create();

App.Router.map(function() {
	// put your routes here
});

App.FileRoute = Ember.Route.extend({
	model: function(params) {
		'use strict';
		return this.store.find('file', params.file_id);
	}
});

App.FileAdapter = DS.RESTAdapter.extend({
	namespace: 'api/v2',
	host: 'https://api.example2.com'
});