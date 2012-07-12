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
				pid = opts.pid;
			if (_.isUndefined(pid) || _.isNull(pid))
				return this.timestamp(opts.url_prefix + "/");
			else
				return this.timestamp(opts.url_prefix + "/" + pid + "/");
		},

		_render: function(model) {
			model.__pid = this.options.pid;
			this.render_template(model, "left", "#main-left",
				{model: model},
				_.bind(this.left_part_event, this)
			);
		}
	});

	return TreeListView;
});

