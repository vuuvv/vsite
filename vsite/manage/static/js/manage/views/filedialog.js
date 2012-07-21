define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/filemanage/filedialog.html',
	'text!templates/filemanage/filelist.html',
	'text!templates/filemanage/file.html',
	'text!templates/filemanage/folder.html',
	'swfupload',
	'swfupload_queue',
	'artdialog'
], function($, _, Backbone, FileDialogTemplate, FileListTemplate, FileTemplate, FolderTemplate) {
	var hover_toggle_class = function(dom, name) {
		dom.hover(function() {
			$(this).addClass(name);
		}, function() {
			$(this).removeClass(name);
		});
	};

	var FileDialog = Backbone.View.extend({
		defaults: {
			width: 640,
			height: 480
		},

		info: null,

		dialog: null,

		dialog_tmpl: _.template(FileDialogTemplate),
		list_tmpl: _.template(FileListTemplate),
		file_tmpl: _.template(FileTemplate),
		folder_tmpl: _.template(FolderTemplate),

		initialize: function() {
			this.options = $.extend({}, this.defaults, this.options);
			this.queues = {};
		},

		new_folder: function(name) {
			var info = this.info;

			$.ajax("/files/newfolder/", {
				data: {
					csrfmiddlewaretoken: config.get_cookie("csrftoken"),
					path: info.current_path, 
					name: name
				},
				type: "POST",
				dataType: "json",
				success: _.bind(this.on_new_folder_success, this),
				error: _.bind(this.on_http_error, this)
			});
		},

		show: function() {
			this.dialog.show();
		},

		hide: function() {
			this.dialog.hide();
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

		render_file: function(file) {
			return this.file_tmpl({
				file: file
			});
		},

		render_folder: function(folder) {
			return this.folder_tmpl({
				info: this.info,
				folder: folder
			});
		},

		render_dialog: function() {
			//$("#filedialog").html(this.dialog_tmpl({}));
			this.dialog = art.dialog({
				title: "File Browser",
				padding: "0",
				content: this.dialog_tmpl({}),
				close: _.bind(this.on_dialog_close, this)
			});

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
			hover_toggle_class($("#fd-upload-progress dt"), "fd-hover");
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

		add_file_item_event: function(item, is_folder) {
			item.hover(function() {
				$(this).addClass("fd-list-selected");
			}, function() {
				var $this = $(this);
				if (!$this.find(".fd-list-check").is(":checked"))
					$this.removeClass("fd-list-selected");
			});
			if (is_folder)
				item.find(".fd-folder-link").click(_.bind(this.on_folder_click, this));
		},

		add_file_to_list: function(file) {
			var dom = $(this.render_file(file));
			$(".fd-icon-list").append(dom);
			this.add_file_item_event(dom);
		},

		add_folder_to_list: function(folder) {
			var dom = $(this.render_folder(folder));
			$(".fd-icon-list").append(dom);
			this.add_file_item_event(dom, true);
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
			hover_toggle_class(dt, "fd-hover");
			var self = this;
			status.click(function() {
				var $this = $(this);
				self.uploader.cancelUpload(file.id);
				dt.remove();
				$this.unbind("click");
				$this.disable();
			});
		},

		on_new_folder: function() {
			var self = this;
			art.dialog.prompt('Please input the folder name', function (val) {
				self.new_folder(val);
			}, 'new folder');
		},

		on_new_folder_success: function(data) {
			if (data.status === "success") {
				app.success(data.msg);
				this.add_folder_to_list(data.folder);
			} else {
				app.error(data.msg);
			}
		},

		// turn function close to hide
		on_dialog_close: function() {
			this.dialog.hide();
			return false;
		},

		on_render_list: function(data) {
			this.info = data;

			$("#fd-browser").html(this.list_tmpl(data));
			$(".fd-folder-link").click(_.bind(this.on_folder_click, this));

			var list = $("#fd-icon-list"),
				self = this;
			_.each(data.folders, function(folder) {
				self.add_folder_to_list(folder);
			});
			_.each(data.files, function(file) {
				self.add_file_to_list(file);
			});

			$("#fd-btn-new-folder").click(_.bind(this.on_new_folder, this));
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
				path: this.info.current_path,
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
			var data = eval("(" + server_data + ")");
			if (data.status === "success") {
				app.success(data.msg);
				var dt = $("#" + file.id);
				dt.find(".fd-upload-file").removeClass("fd-cancelable").addClass("fd-ok");
				dt.find(".fd-progress").remove();
				dt.find(".fd-upload-file-status").unbind("click");
				if (this.info.current_path === data.current_path)
					this.add_file_to_list(data.file);
			}
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
