define([
	'jquery',
	'underscore',
	'backbone',
	'config',
	'views/model'
], function($, _, Backbone, config, ModelView) {
	var ListView = ModelView.extend({
		get_load_url: function() {
			return this.get_list_url();
		},

		_render: function(model) {
			model = model.toJSON();
			this._render_left_part(model);
		},

		_render_left_part: function(model, type) {
			var self = this; 
				template = config.get_template(model, "list", "left");
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

	return ListView;
});

