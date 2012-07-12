require.config({
	paths: {
		jquery: '../libs/jquery/jquery-min',
		plugins: '../plugins',
		underscore: '../libs/underscore/underscore',
		backbone: '../libs/backbone/backbone',
		xheditor: '../libs/xheditor/xheditor-1.1.14-en.min',
		text: '../libs/require/text',
		config: 'config'
	}
});

require(['jquery', 'underscore', 'backbone', 'config', "plugins"],

function($, _, Backbone, config) {
	var custom_views = ["page"];

	var norm_model = function(model) {
		return unescape(model).toLowerCase().replace(/[ -]+/g, "_");
	};

	var ManageApp = Backbone.Router.extend({
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

		initialize: function(options) {
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

		reload: function() {
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
		}
	});

	$("#global-header").width($("#main-body").width());
	$("#global-header .menu li.menu-item").hover(function() {
		$(this).addClass("current");
	}, function(){
		$(this).removeClass("current");
	});

	app = new ManageApp;
	Backbone.history.start();
});

