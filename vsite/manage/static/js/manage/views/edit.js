define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'views/widgets',
	'views/model',
	'plugins',
	'xheditor'
], function($, _, Backbone, config, widgets, ModelView) {
	var EditView = ModelView.extend({

		get_load_url: function() {
			var type = this.options.type;
			if (type == "add")
				return this.get_add_url();
			else if (type == "update")
				return this.get_update_url();
			throw "wrong operate type";
		},

		_render: function(model) {
			// TODO: dispatch the model to specified view
			var fields = model.get("fields"),
				module_name = model.get("module_name"),
				app_label = model.get("app_label");
			for (var i = 0; i < fields.length; i++) {
				var field = fields[i];
				var widget = new widgets[field.widget]({
					app_label: app_label,
					module_name: module_name,
					type: this.options.type,
					field: field
				});
				field.html = widget.render();
			}

			model = model.toJSON();
			this._render_left_part(model, this.options.type);
		},

		_render_left_part: function(model, type) {
			var self = this, 
				template = config.get_template(model, "edit", "left");
			require([template], function(t) {
				var tmpl = _.template(t);
				$("#main-left").html(tmpl({
					type: type,
					model: model
				}));
				$("textarea.xheditor").xheditor();
				$("#main-form-submit").click(_.bind(self.on_submit, self));
			});
		},

		get_form_data: function() {
			var inputs = $("#main-form").find("select, input, textarea"),
				data = {
					csrfmiddlewaretoken: this.model.get("csrf_token")
				};

			inputs.each(function(index, elem) {
				if (!elem.readOnly)
					data[elem.name] = $(elem).val();
			});
			return data;
		},

		on_submit: function() {
			app.info("Saving...");
			var now = new Date;
			$.ajax(this.get_load_url(), {
				type: "POST",
				data: this.get_form_data(),
				dataType: "json",
				error: _.bind(this.on_http_error, this),
				success: _.bind(this.on_success, this)
			});
		},

		on_success: function(data) {
			if (data.status == "error")
				app.error(data.msg, true);
			else {
				app.success(data.msg, true);
				if (this.options.type == "add") {
					app.navigate(data.app_label + "/" + data.module_name + "/" + data.id, {trigger: true});
					return;
				} else {
					this.model.set("fields", data.fields);
					this._render(this.model);
				}
			}
		}
	});

	return EditView;
});


