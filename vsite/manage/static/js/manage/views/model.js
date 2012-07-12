define([
	'jquery',
	'underscore',
	'backbone',
], function($, _, Backbone) {
	var ModelView = Backbone.View.extend({

		initialize: function() {
			this.model = this.get_model();
		},

		get_model: function() {
			Model = Backbone.Model.extend({
			});
			return new Model;
		},

		timestamp: function(url) {
			var now = new Date;
			return url + "?" + now.getTime();
		},

		get_list_url: function() {
			var opts = this.options;
			return this.timestamp(opts.url_prefix + "/");
		},

		get_add_url: function() {
			var opts = this.options;
			return this.timestamp(opts.url_prefix + "/add/");
		},

		get_update_url: function() {
			var opts = this.options;
			return this.timestamp(opts.url_prefix + "/update/" + opts.model_id + "/");
		},

		get_delete_url: function(id) {
			var opts = this.options;
			return this.timestamp(opts.url_prefix + "/delete/");
		},

		render: function() {
			app.info("Loading...");
			var model = this.model,
				now = new Date;
			model.url = this.get_load_url();
			this.model.fetch({
				success: _.bind(this.on_fetched_model, this),
				error: _.bind(this.on_fetched_error, this)
			});
			return this;
		},

		render_template: function(model, part, where, data, callback) {
			var self = this,
				view = this.view,
				tmpl = config.get_template(model.app_label, model.module_name, view, part);
			require([tmpl], function(t) {
				var tmpl = _.template(t);
				$(where).html(tmpl(data));
				callback();
			});
		},

		on_fetched_model: function() {
			var model = this.model,
				status = model.get("status");

			if (status == "error") {
				app.error(model.get("msg"), true);
				return;
			}
			app.success(model.get("msg"), true);

			model.set("url_prefix", this.options.url_prefix);
			this._render(model);
		},

		on_fetched_error: function() {
			app.error("Loading Error", true);
		},

		on_http_error: function(jqXHR, textStatus, errorThrown) {
			app.error("Server Error", true);
		}
	});

	return ModelView;
});
