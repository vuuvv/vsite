define(function(require, exports, module) {
	require('vuuvv/util');
	require('vuuvv/window');

	var norm_model = function(model) {
		return unescape(model).toLowerCase().replace(/[ -]+/g, "_");
	};

	var ManageApp = Backbone.Router.extend({
		filebrowser: null,

		routes: {
			"": "index",
			"logout": "logout",
			"filemanage": "filemanage",
			"apps": "apps"
			/*
			"m/:app/:model/add": "add",
			"m/:app/:model/:id": "update",
			"m/:app/:model": "list",
			"m/:app/:model/p/:page": "list",
			"m/:app/:model/add/:pid": "tree_add",
			"m/:app/:model/:pid/": "tree_list",
			"m/:app/:model/:pid/p/:page": "tree_list"
			*/
		},

		csrf_token: null,

		initialize: function(options) {
		},

		log: function(msg) {
			console.log(msg);
		},

		alert: function(msg) {
			alert(msg);
		},

		msg: function(msg, type, is_flash) {
			type = type || "info";
			var cls = "notify-" + type,
				duration = null,
				$notify = $(".notify").notify();
			if (is_flash) 
				duration = 2000;
			$notify.notify(type, msg, duration);
		},

		info: function(msg, is_flash) {
			this.msg(msg, "info", is_flash);
		},

		error: function(msg, is_flash) {
			this.msg(msg, "error", is_flash);
		},

		warning: function(msg, is_flash) {
			this.msg(msg, "warning", is_flash);
		},

		success: function(msg, is_flash) {
			this.msg(msg, "success", is_flash);
		},

		logout: function() {
		},

		index: function() {
			//this.list("pages", "page");
		},

		apps: function() {
		},

		list: function(app, model, page) {
			page = parseInt(page);
			// pages start from 1
			page = page || 1;
			this._render(app, model, "list", {
				type: "list",
				page: page
			});
		},

		tree_list: function(app, model, pid, page) {
			page = parseInt(page);
			// pages start from 1
			page = page || 1;
			this._render(app, model, "list", {
				type: "list",
				page: page,
				pid: pid || null
			});
		},

		add: function(app, model) {
			this._render(app, model, "edit", {
				type: "add"
			});
		},

		tree_add: function(app, model, pid) {
			this._render(app, model, "edit", {
				type: "add",
				pid: pid
			});
		},

		update: function(app, model, id) {
			// tell if id is  integer
			this._render(app, model, "edit", {
				type: "update",
				model_id: id
			});
		},

		refresh: function() {
			Backbone.history.fragment = null;
			Backbone.history.navigate(document.location.hash, true);
		},

		back: function() {
			window.history.back();
		},

		_render: function(app, model, view, options) {
			model = norm_model(model);
			options["url_prefix"] = app + "/" + model;
			require.async(config.get_view(app, model, view), function(View) {
				var view = new View(options);
				view.render();
			});
		},

		filemanage: function() {
			var win = vuuvv.window({
				title: "Hello World",
				content: "<h1>Hello World</h1><h1>Hello World</h1><h1>Hello World</h1>",
				minable: false,
				resizable: true
			});
			win.open();
		},

		file_manage: function(path, callback) {
			var self = this;
			if (this.filebrowser === null) {
				require.async("manage/views/filedialog", function(Dialog) {
					if (_.isFunction(path)) {
						callback = path;
						path = "";
					} else {
						path = path || "";
					}

					var dialog = new Dialog({
						current_path: path,
						select_callback: callback
					});
					dialog.render();
					self.filebrowser = dialog;
				});
			} else {
				this.filebrowser.show(path, callback);
			}
		}
	});

	app = new ManageApp;
	Backbone.history.start();
});
