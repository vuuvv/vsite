define(function(require) {
	var config = require('manage/config'),
		FileDialogTemplate = require('manage/templates/filemanage/filedialog.tpl'),
		FileListTemplate = require('manage/templates/filemanage/filelist.tpl'),
		FileTemplate = require('manage/templates/filemanage/file.tpl'),
		FolderTemplate = require('manage/templates/filemanage/folder.tpl');

	require('swfupload');
	require('swfupload_queue');

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

		target: null,

		info: null,

		dialog: null,

		dialog_tmpl: _.template(FileDialogTemplate),
		list_tmpl: _.template(FileListTemplate),
		file_tmpl: _.template(FileTemplate),
		folder_tmpl: _.template(FolderTemplate),

		initialize: function() {
			this.options = $.extend({}, this.defaults, this.options);
			this.queues = {};
			if (this.options.target)
				this.target = $(this.options.target);
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

		delete_files: function(files) {
			$.ajax("/files/delete/", {
				data: {
					csrfmiddlewaretoken: config.get_cookie("csrftoken"),
					path: this.info.current_path,
					files: files
				},
				type: "POST",
				dataType: "json",
				success: _.bind(this.on_delete_success, this),
				error: _.bind(this.on_http_error, this)
			});
		},

		select_item: function(check_box) {
			check_box.parents(".fd-list-item").addClass("fd-list-selected");
			check_box.attr("checked", true);
		},

		unselect_item: function(check_box) {
			check_box.parents(".fd-list-item").removeClass("fd-list-selected");
			check_box.removeAttr("checked");
		},

		get_selected_files: function() {
			var self = this,
				inputs = $(".fd-list-check:checked");
			if (inputs.length === 0) 
				return null;
			var text_doms = inputs.parents(".fd-file").find(".fd-list-txt"),
				files = [];

			text_doms.each(function() {
				files.push($(this).text());
			});
			return files;
		},

		get_selected_folder_and_files: function() {
			var self = this,
				inputs = $(".fd-list-check:checked");
			if (inputs.length === 0) 
				return null;
			var text_doms = inputs.parents(".fd-list-item").find(".fd-list-txt"),
				files = [];

			text_doms.each(function() {
				files.push($(this).text());
			});
			return files;
		},

		show: function(target) {
			this.dialog.show();
			if (target)
				this.target = $(target);
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
				config: config,
				file: file
			});
		},

		render_folder: function(folder) {
			return this.folder_tmpl({
				config: config,
				info: this.info,
				folder: folder
			});
		},

		render_dialog: function() {
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
				item.find(".fd-folder-link").click(_.bind(this.on_folder_link_click, this));
		},

		add_to_list: function(file, is_folder) {
			var dom = is_folder ? $(this.render_folder(file)) : $(this.render_file(file));
			dom.data("file", file.name);
			$(".fd-icon-list").append(dom);
			this.add_file_item_event(dom, is_folder);
		},

		remove_from_list: function(files) {
			var file_items = $(".fd-list-item");
			file_items.each(function() {
				var file = $(this);
				if (_.indexOf(files, file.data("file")) >= 0) {
					$(this).remove();
				}
			});
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
				this.add_to_list(data.folder, true);
			} else {
				app.error(data.msg);
			}
		},

		on_delete: function() {
			var self = this,
				files = this.get_selected_folder_and_files();
			if (files === null) {
				art.dialog.alert("Please select a file!");
			} else {
				art.dialog.confirm("Are you sure delete these files?", function() {
					self.delete_files(files);
				});
			}
		},

		on_delete_success: function(data) {
			if (data.status === "success") {
				if (data.errors.length > 0) {
					var msg = "Can't delete " + data.errors.join(",");
					app.warning(msg);
				} else {
					app.success(data.msg);
				}
				this.remove_from_list(data.files);
			} else {
				app.error(data.msg);
			}
		},

		on_select: function() {
			var files = this.get_selected_files();
			if (files === null || files.length < 1) {
				art.dialog.alert("Please select a file!");
			} else if (files.length > 1) {
				art.dialog.alert("You can only choose a file!");
			} else {
				this.target.val(this.info.current_path + "/" + files[0]);
				this.hide();
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
			$(".fd-folder-link").click(_.bind(this.on_folder_link_click, this));

			var list = $("#fd-icon-list"),
				self = this;
			_.each(data.folders, function(folder) {
				self.add_to_list(folder, true);
			});
			_.each(data.files, function(file) {
				self.add_to_list(file);
			});

			$(".fd-list-item").click(_.bind(this.on_file_check, this));
			$("#fd-list-check-all").click(_.bind(this.on_check_all, this));
			$("#fd-btn-delete").click(_.bind(this.on_delete, this));
			$("#fd-btn-new-folder").click(_.bind(this.on_new_folder, this));
			$("#fd-btn-select").click(_.bind(this.on_select, this));
		},

		on_file_check: function(e) {
			var $this = $(e.currentTarget);
			if ($this.is(":checked")) {
				this.select_item($this);
			} else {
				this.unselect_item($this);
				var check_all = $("#fd-list-check-all");
				if ($("#fd-list-check-all").is(":checked")) {
					check_all.removeAttr("checked");
				}
			}
		},

		on_check_all: function(e) {
			var $this = $(e.currentTarget),
				all_check_box = $(".fd-list-check");
			if ($this.is(":checked")) {
				this.select_item(all_check_box);
			} else {
				this.unselect_item(all_check_box);
			}
		},

		on_folder_link_click: function(e) {
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
				csrfmiddlewaretoken: config.get_cookie("csrftoken"),
				path: this.info.current_path
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
					this.add_to_list(data.file);
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
