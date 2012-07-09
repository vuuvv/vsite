define([
	'jquery',
	'underscore',
	'backbone',
	'views/fields',
	'text!templates/edit/left.html',
	'text!templates/edit/right.html',
	'plugins'
], function($, _, Backbone, Fields, left_tmpl, right_tmpl) {
	var EditView = Backbone.View.extend({

		left_template: _.template(left_tmpl),
		right_template: _.template(right_tmpl),

		initialize: function() {
			this.model = this.get_model();
		},

		get_model: function() {
			var opts = this.options, Model
				type = opts.type;
			if (type == "add") {
				Model = Backbone.Model.extend({
					url: opts.app_label + "/" + opts.model_name + "/" + opts.type + "/"
				});
			} else if(type == "update") {
				Model = Backbone.Model.extend({
					url: opts.app_label + "/" + opts.model_name + "/" + opts.model_id + "/"
				});
			}
			return new Model;
		},

		render: function() {
			app.info("Loading...");
			this.model.fetch({
				success: _.bind(this.on_fetched_fields, this),
				error: _.bind(this.on_fetched_error, this)
			});
			return this;
		},

		on_fetched_error: function() {
			app.error("Loading Error", true);
		},

		on_fetched_fields: function() {
			var model = this.model, fields, hidden_fields,
				status = model.get("status");

			if (status == "error") {
				app.error(model.get("msg"), true);
				return;
			}
			app.success("Data Loaded", true);

			fields = model.get("fields");
			for (var i = 0; i < fields.length; i++) {
				var field = fields[i];
				var client_field = new Fields[field.type]({
					app_label: model.get("app_label"),
					module_name: model.get("module_name"),
					type: this.options.type,
					field: field
				});
				field.html = client_field.html(type);
			}

			$("#main-left").html(this.left_template({
				type: this.options.type,
				model: model.toJSON()
			}));
			$("#main-form-submit").click(_.bind(this.on_submit, this));
		},

		get_form_data: function() {
			var inputs = $("#main-form").find("select, input"),
				data = {
					csrfmiddlewaretoken: this.model.get("csrf_token")
				};

			inputs.each(function(index, elem) {
				if (!elem.readOnly)
					data[elem.name] = elem.value;
			});
			return data;
		},

		get_form_url: function() {
			var model = this.model,
				url = model.get("app_label") + "/" + model.get("module_name") + "/",
				type = this.options.type;

			if (type == "add")
				return url + "add/";
			else
				return url + this.options.model_id + "/";
		},

		on_submit: function() {
			app.info("Saving...");
			$.ajax(this.get_form_url(), {
				type: "POST",
				data: this.get_form_data(),
				dataType: "json",
				error: _.bind(this.on_http_error, this),
				success: _.bind(this.on_success, this)
			});
		},

		on_http_error: function(jqXHR, textStatus, errorThrown) {
			app.error("Server Error", true);
		},

		on_success: function(data) {
			if (data.status == "error")
				app.error(data.msg, true);
			else
				app.success("Save Successful", true);
		}
	});

	return EditView;
});


