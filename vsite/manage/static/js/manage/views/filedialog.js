define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/filedialog.html'
], function($, _, Backbone, FileDialogTemplate) {
	var FileDialog = Backbone.View.extend({
		defaults: {
			width: 480,
			height: 360
		},

		template: _.template(FileDialogTemplate),

		initialize: function() {
			this.options = $.extend({}, this.defaults, this.options);
		},

		render: function() {
			$("#filedialog").html(this.template({}));


			var opts = this.options,
				width = opts.width,
				height = opts.height,
				w = $("body").width(),
				h = $("body").height(),
				left = (w - width) / 2,
				top = (h - height) / 2;

			$("#filedialog").css({
				width: width,
				height: height,
				top: top,
				left: left
			}).show();
		}
	});
	return FileDialog;
});
