define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/app.html'
], function($, _, Backbone, app_template) {
	var AppView = Backbone.View.extend({
		initialize: function() {
			$("#global-header").width($("#main").width());
		}
	});
	return AppView;
});
