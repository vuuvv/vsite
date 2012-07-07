define([
	'jquery',
	'underscore',
	'backbone',
	'views/fields',
	'text!templates/edit/left.html',
	'text!templates/edit/right.html'
], function($, _, Backbone, Fields, left_tmpl, right_tmpl) {
	var EditView = Backbone.View.extend({

		left_template: _.template(left_tmpl),
		right_template: _.template(right_tmpl),

		initialize: function() {
			var opts = this.options;
			this.url = opts.app_label + "/" + opts.model_name + "/" + opts.type + "/";
			var Model = Backbone.Model.extend({
				url: this.url
			});
			this.model = new Model;
		},

		render: function() {
			this.model.fetch({
				success: _.bind(this.on_fetched_fields, this)
			});
			return this;
		},

		on_fetched_fields: function() {
			var model = this.model,
				fields = model.get("fields");
			for (var i = 0; i < fields.length; i++) {
				var field = fields[i];
				field["app_label"] = model.get("app_label");
				field["module_name"] = model.get("module_name");
				var client_field = new Fields[field.type](field);
				field.html = client_field.html();
			}
			$("#main-left").html(this.left_template({
				type: this.options.type,
				model: model.toJSON()
			}));
		}
	});

	return EditView;
});


