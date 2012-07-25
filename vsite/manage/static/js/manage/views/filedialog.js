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
			height: 480,
			current_path: ""
		},

		base_url: "/static/media",

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
					path: this.options.current_path,
					name: name
				},
				type: "POST",
				dataType: "json",
				success: _.bind(this.on_new_folder_success, this),
				error: _.bind(this.on_http_error, this)
			});
		},

		delete_files: function(doms) {
			var self = this;
			$.ajax("/files/delete/", {
				data: {
					csrfmiddlewaretoken: config.get_cookie("csrftoken"),
					path: this.options.current_path,
					files: this.get_names(doms) 
				},
				type: "POST",
				dataType: "json",
				success: function(data) {
					self.on_delete_success(data, doms);
				},
				error: _.bind(this.on_http_error, this)
			});
		},

		rename_file: function(dom, new_name) {
			var self = this;
			$.ajax("/files/rename/", {
				data: {
					csrfmiddlewaretoken: config.get_cookie("csrftoken"),
					path: this.options.current_path,
					name: dom.data("file"),
					new_name: new_name
				},
				type: "POST",
				dataType: "json",
				success: function(data) {
					self.on_rename_success(data, dom);
				},
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

		select_all_item: function() {
			this.select_item($(".fd-list-check"));
		},

		unselect_all_item: function() {
			this.unselect_item($(".fd-list-check"));
		},

		get_names: function(doms) {
			var names = [];
			doms.each(function() {
				names.push($(this).data("file"));
			});
			return names;
		},

		get_selected_files: function() {
			return $(".fd-list-check:checked").parents(".fd-file");
		},

		get_selected_folder_and_files: function() {
			return $(".fd-list-check:checked").parents(".fd-list-item");
		},

		_show: function(path, callback) {
			this.options.select_callback = callback || null;
			if (callback) {
				var btn = $("#fd-btn-select");
				if (btn.length > 0) {
				} else {
					$("<button>").attr("id", "fd-btn-select").appendTo($(".fd-tool-bar")).click(_.bind(this.on_select, this));
				}
			} else {
				$("#fd-btn-select").remove();
			}
			if (path === this.options.current_path) {
				this.dialog.show();
			} else {
				this.render_list(path);
			}
		},

		show: function(path, callback) {
			var current_path = this.options.current_path;
			if (_.isFunction(path)) {
				callback = path;
				path = current_path;
			} else {
				path = path || current_path;
			}
			this._show(path, callback);
		},

		hide: function() {
			this.unselect_all_item();
			this.dialog.hide();
		},

		render: function() {
			this.render_dialog();
			this.render_list(this.options.current_path);
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

		remove_from_list: function(files, doms) {
			doms.each(function() {
				var dom = $(this);
				if (_.indexOf(files, dom.data("file")) >= 0) {
					dom.remove();
				}
			});
		},

		rename: function(new_name, dom) {
			dom.find(".fd-list-txt").text(new_name);
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

		on_rename: function() {
			var self = this,
				files = this.get_selected_folder_and_files();

			if (files.length < 1) {
				art.dialog.alert("Please select a file!");
			} else if (files.length > 1) {
				art.dialog.alert("You can only choose one file!");
			} else {
				var filename = files.data("file");
				art.dialog.prompt("Please input the new file name", function(val) {
					if (filename !== val)
						self.rename_file(files, val);
				}, filename);
			}
		},

		on_rename_success: function(data, dom) {
			if (data.status === "success") {
				app.success(data.msg);
				this.rename(data.new_name, dom);
			} else {
				app.error(data.msg);
			}
		},

		on_delete: function() {
			var self = this,
				files = this.get_selected_folder_and_files();
			if (files.length < 1) {
				art.dialog.alert("Please select a file!");
			} else {
				art.dialog.confirm("Are you sure delete these files?", function() {
					self.delete_files(files);
				});
			}
		},

		on_delete_success: function(data, doms) {
			if (data.status === "success") {
				if (data.errors.length > 0) {
					var msg = "Can't delete " + data.errors.join(",");
					app.warning(msg);
				} else {
					app.success(data.msg);
				}
				this.remove_from_list(data.files, doms);
			} else {
				app.error(data.msg);
			}
		},

		on_select: function() {
			var doms = this.get_selected_files();
			if (doms.length < 1) {
				art.dialog.alert("Please select a file!");
			} else if (doms.length > 1) {
				art.dialog.alert("You can only choose one file!");
			} else {
				var fn = this.options.select_callback, file = doms[0].data("file");
				if (fn) {
					if (this.options.current_path === "") {
						fn(this.base_url + "/" + file);
					} else {
						fn(this.base_url + "/" + this.options.current_path + "/" + file);
					}
				}
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
			this.options.current_path = data.current_path;

			$("#fd-browser").html(this.list_tmpl({
				info: data,
				has_select_btn: !!this.options.select_callback
			}));
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
			$("#fd-btn-rename").click(_.bind(this.on_rename, this));
			$("#fd-btn-select").click(_.bind(this.on_select, this));

			this.dialog.show();
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
			var $this = $(e.currentTarget);
			if ($this.is(":checked")) {
				this.select_all_item();
			} else {
				this.unselect_all_item();
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
				path: this.options.current_path
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
				if (this.options.current_path === data.current_path)
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
