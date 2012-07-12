define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'views/common/list'
], function($, _, Backbone, config, ListView) {
	var TreeListView = ListView.extend({
		get_list_url: function() {
			var opts = this.options,
				model_id = opts.model_id;
			if (_.isUndefined(model_id) || _.isNull(model_id))
				return this.timestamp(opts.url_prefix + "/");
			else
				return this.timestamp(opts.url_prefix + "/" + model_id + "/");
		},

		_render: function(model) {
			model = model.toJSON();
			this._render_left_part(model);
		},

		_render_left_part: function(model, type) {
			var self = this; 
				template = config.get_template(model.app_label, model.module_name, "list", "left");
			require([template], function(t) {
				var tmpl = _.template(t);
				$("#main-left").html(tmpl({
					model: model
				}));
				$(".fileviewer tr").hover(function() {
					$(this).addClass("file-row-hovered");
				}, function() {
					$(this).removeClass("file-row-hovered");
				});
				$(".model-delete-btn").click(_.bind(self.on_delete, self));
			});
		}
	});

	return TreeListView;
});

