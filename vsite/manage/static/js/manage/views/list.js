define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/list/left.html',
	'text!templates/list/right.html'
], function($, _, Backbone, left_tmpl, right_tmpl) {
	var ListView = Backbone.View.extend({
		left_template: _.template(left_tmpl),
		right_template: _.template(right_tmpl),

		initialize: function(options) {
		},

		render: function() {
			$("#main-left").html(this.left_template());
			return this;
		}
	});

	return ListView;
});

