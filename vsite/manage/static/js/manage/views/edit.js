define([
	'jquery',
	'underscore',
	'backbone',
	'collections/fields',
	'text!templates/edit/left.html',
	'text!templates/edit/right.html'
], function($, _, Backbone, Fields, left_tmpl, right_tmpl) {
	var EditView = Backbone.View.extend({

		left_template: _.template(left_tmpl),
		right_template: _.template(right_tmpl),

		initialize: function(options) {
		},

		render: function() {
			var fields = this.fields = new Fields;
			fields.fetch({
				success: _.bind(this.on_fetched_fields, this)
			});
			return this;
		},

		on_fetched_fields: function() {
			this.fields.type = this.options.type;
			this.fields.model_name = this.options.model_name;

			$("#main-left").html(this.left_template({
				fields: this.fields
			}));
		}
	});

	return EditView;
});


