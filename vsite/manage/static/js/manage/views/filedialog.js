define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/filemanage/filedialog.html',
	'text!templates/filemanage/filelist.html',
	'swfupload',
	'swfupload_queue'
], function($, _, Backbone, FileDialogTemplate, FileListTemplate) {
	var add_dt_event = function(dt) {
		dt.hover(function() {
			$(this).addClass("fd-hover");
		}, function() {
			$(this).removeClass("fd-hover");
		});
	};

	var FileDialog = Backbone.View.extend({
		defaults: {
			width: 640,
			height: 480
		},

		dialog_tmpl: _.template(FileDialogTemplate),
		list_tmpl: _.template(FileListTemplate),

		initialize: function() {
			this.options = $.extend({}, this.defaults, this.options);
			this.queues = {};
		},

		render: function() {
			this.render_dialog();
			this.render_list("");
		},

		render_list: function(path) {
			$.ajax("/files/browse/" + path, {
				dataType: "json",
				success: _.bind(this.on_render_list, this),
				error: _.bind(this.on_http_error, this)
			});
		},

		render_dialog: function() {
			$("#filedialog").html(this.dialog_tmpl({}));

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

				swfupload_preload_handler: _.bind(this.on_preload, this),
				swfupload_load_failed_handler: _.bind(this.on_load_failed, this),
				file_queued_handler: _.bind(this.on_file_queued, this),
				file_queue_error_handler: _.bind(this.on_file_queue_error, this),
				file_dialog_complete_handler: _.bind(this.on_file_dialog_complete, this),
				upload_start_handler: _.bind(this.on_upload_start, this),
				upload_progress_handler: _.bind(this.on_upload_progress, this),
				upload_error_handler: _.bind(this.on_upload_error, this),
				upload_success_handler: _.bind(this.on_upload_success, this),
				upload_complete_handler: _.bind(this.on_upload_complete, this),
				queue_complete_handler: _.bind(this.on_queue_complete, this),

				debug: true,
				debug_handler: function(msg) {
					//app.log(msg);
				}
			});

			this.$queue = $("#fd-upload-progress");
			add_dt_event($("#fd-upload-progress dt"));
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

		add_file_to_queue: function(file) {
			var $queue = this.$queue,
				dt = $("<dt>").attr("id", file.id),
				item = $("<div>").addClass("fd-upload-file fd-cancelable"),
				status = $("<a>").addClass("fd-upload-file-status").attr("href", "javascript:void(0)"),
				progress = $("<span>").addClass("fd-progress").text("0%"),
				name = $("<a>").addClass("fd-upload-name").attr({
					href: "javascript:void(0)",
					title: file.name
				}).text(file.name);

			item.append(status).append(progress).append(name);
			dt.append(item);
			$queue.append(dt);

			//event;
			add_dt_event(dt);
			var self = this;
			status.click(function() {
				var $this = $(this);
				self.uploader.cancelUpload(file.id);
				dt.remove();
				$this.unbind("click");
				$this.disable();
			});
		},

		on_render_list: function(data) {
			$("#fd-browser").html(this.list_tmpl(data));

			$(".fd-list-item").hover(function() {
				$(this).addClass("fd-list-selected");
			}, function() {
				var $this = $(this);
				if (!$this.find(".fd-list-check").is(":checked"))
					$this.removeClass("fd-list-selected");
			});
			$(".fd-folder-link").click(_.bind(this.on_folder_click, this));
		},

		on_folder_click: function(e) {
			var path = $(e.currentTarget).attr("data");
			path = path || "";
			this.render_list(path);
		},

		on_http_error: function(jqXHR, textStatus, errorThrown) {
			app.error("Server Error", true);
		},

		on_preload: function() {
			if (!this.support.loading) {
				app.alert("You need the Flash Player 9.028 or above to use SWFUpload");
				return false;
			}
		},

		on_load_failed: function() {
			app.alert("Something went wrong while loading SWFUpload. If this were a real application we'd clean up and then give you an alternative");
		},

		on_file_queued: function(file) {
			this.add_file_to_queue(file);
		},

		on_file_queue_error: function(file, error, msg) {
		},

		on_file_dialog_complete: function() {
			var uploader = this.uploader;
			uploader.setPostParams({
				path: "test",
				csrfmiddlewaretoken: app.csrf_token
			});
			this.set_swfupload_cookies();
			uploader.startUpload();
		},

		on_upload_start: function(file) {
		},

		on_upload_progress: function(file, loaded, total) {
			var percent = Math.ceil((loaded / total) * 100);
			$("#"+file.id).find(".fd-progress").text(percent + "%");
		},

		on_upload_success: function(file, server_data) {
			app.log(server_data);
			var dt = $("#" + file.id);
			dt.find(".fd-upload-file").removeClass("fd-cancelable").addClass("fd-ok");
			dt.find(".fd-progress").remove();
			dt.find(".fd-upload-file-status").unbind("click");
		},

		on_upload_error: function(file, error, msg) {
			app.error(file.name + " upload error");
			var elem = $("#" + file.id),
				name = elem.find(".fd-upload-name"),
				progress = elem.find(".fd-progress");

			name.html("<strike>" + name.text() + "</strike>");
			progress.html("<strike>0%</strke>");
		},

		on_upload_complete: function(file) {
		},

		on_queue_complete: function(files_count) {
			app.success("Upload Completed");
		}

	});
	return FileDialog;
});
