define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/filedialog.html',
	'swfupload'
], function($, _, Backbone, FileDialogTemplate) {
	var FileDialog = Backbone.View.extend({
		defaults: {
			width: 640,
			height: 480
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

			this.uploader = new SWFUpload({
				flash_url : "/static/js/libs/swfupload/swfupload.swf",
				upload_url: "/files/upload/",

				// button settings
				button_image_url: "/static/img/uploadbtn.png",
				button_width: "54",
				button_height: "28",
				button_placeholder_id: "upload-btn",
				button_cursor: SWFUpload.CURSOR.HAND,

				file_dialog_complete_handler: _.bind(this.file_dialog_complete, this),

				debug: true,
				debug_handler: function(msg) {
					console.log(msg);
				}
			});
		},

		set_swfupload_cookies: function() {
			var uploader = this.uploader,
				cookies = document.cookie.split(';'),
				cookies_len = cookies.length,
				post_params = uploader.settings.post_params;

			for (var i = 0; i < cookies_len; i++) {
				var c = cookies[i];

				// Left trim spaces
				c = c.replace(/^\s+/, "");
				var parts = c.split('=');
				if (parts.length == 2) {
					post_params["__c__"+parts[0]] = parts[1];
				}
			}

			uploader.setPostParams(post_params);
		},

		file_dialog_complete: function() {
			var uploader = this.uploader;
			uploader.setPostParams({
				path: "test",
				csrfmiddlewaretoken: app.csrf_token
			});
			this.set_swfupload_cookies();
			uploader.startUpload();
		}
	});
	return FileDialog;
});
