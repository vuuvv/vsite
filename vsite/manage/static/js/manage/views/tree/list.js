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
		}
	});

	return TreeListView;
});

