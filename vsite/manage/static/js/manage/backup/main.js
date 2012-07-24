require.config({
	paths: {
		jquery: '../libs/jquery/jquery-min',
		underscore: '../libs/underscore/underscore',
		backbone: '../libs/backbone/backbone',
		xheditor: '../libs/xheditor/xheditor-1.1.14-en.min',
		kindeditor: '../libs/kindeditor/kindeditor',
		artdialog: '../libs/artdialog/jquery.artDialog.source',
		swfupload: '../libs/swfupload/swfupload',
		swfupload_queue: '../libs/swfupload/plugins/swfupload.queue',
		text: '../libs/require/text',

		config: 'config',
		plugins: '../plugins'
	},
	urlArgs: (new Date()).getTime()
});

require(['config', "plugins", "artdialog"],

function(config) {
	var norm_model = function(model) {
		return unescape(model).toLowerCase().replace(/[ -]+/g, "_");
	};

	var ManageApp = Backbone.Router.extend({
		filebrowser: null,

		routes: {
			"": "index",
			"logout": "logout",
			":app/:model/add": "add",
			":app/:model/:id": "update",
			":app/:model": "list",
			":app/:model/p/:page": "list",
			":app/:model/add/:pid": "tree_add",
			":app/:model/:pid/": "tree_list",
			":app/:model/:pid/p/:page": "tree_list"
		},

		csrf_token: null,

		initialize: function(options) {
		},

		log: function(msg) {
			if (window.console && window.console.log) {
				window.console.log(msg);
			}
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
			this.list("pages", "page");
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

		_render: function(app, model, view, options) {
			model = norm_model(model);
			options["url_prefix"] = app + "/" + model;
			require([config.get_view(app, model, view)], function(View) {
				var view = new View(options);
				view.render();
			});
		},

		file_manage: function() {
			var self = this;
			if (this.filebrowser === null) {
				require(["views/filedialog"], function(Dialog) {
					var dialog = new Dialog;
					dialog.render();
					self.filebrowser = dialog;
				});
			} else {
				this.filebrowser.show();
			}
		}
	});

	app = new ManageApp;
	Backbone.history.start();

	$("#global-header").width($("#main-body").width());
	$("#global-header .menu li.menu-item").hover(function() {
		$(this).addClass("current");
	}, function(){
		$(this).removeClass("current");
	});
	$("a.cmd").click(function() {
		app[$(this).attr("cmd")]();
	});

});

