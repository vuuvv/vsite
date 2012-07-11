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
			return this.timestamp(opts.url_prefix + "/" + opts.model_id + "/");
		},

		get_delete_url: function(id) {
			var opts = this.options;
			return this.timestamp(opts.url_prefix + "/" + id + "/delete/");
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

		on_fetched_model: function() {
			var model = this.model,
				status = model.get("status");

			if (status == "error") {
				app.error(model.get("msg"), true);
				return;
			}
			app.success(model.get("msg"), true);

			this._render(model);
		},

		on_fetched_error: function() {
			app.error("Loading Error", true);
		},

		on_http_error: function(jqXHR, textStatus, errorThrown) {
			app.error("Server Error", true);
		},

		on_delete: function(evt) {
			var elem = $(evt.currentTarget),
				now = new Date;
			$.ajax(this.get_delete_url(elem.attr("model-id")), {
				type: "POST",
				dataType: "json",
				error: _.bind(this.on_http_error, this),
				success: _.bind(this.on_delete_success, this)
			});
			return false;
		},

		on_delete_success: function() {
		}
	});

	return ModelView;
});
