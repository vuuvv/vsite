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
			":app/:model/:id/delete": "remove",
			":app/:model": "list",
			":app/:model/p/:page": "list",
			":app/:model/:id/": "tree_list",
			":app/:model/:id/p/:page": "tree_list"
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
			model = norm_model(model);
			this._render(app, model, "list", {
				url_prefix: app + "/" + model,
				type: "list",
				page: page
			});
		},

		tree_list: function(app, model, id, page) {
			page = parseInt(page);
			// pages start from 1
			page = page || 1;
			model = norm_model(model);
			this._render(app, model, "list", {
				url_prefix: app + "/" + model,
				type: "list",
				page: page,
				model_id: id || null
			});
		},

		add: function(app, model) {
			model = norm_model(model);
			url = app + "/" + model + "/add/";
			this._render(app, model, "edit", {
				url_prefix: app + "/" + model,
				type: "add"
			});
		},

		remove: function(app, mdoel, id) {
		},

		update: function(app, model, id) {
			// tell if id is  integer
			model = norm_model(model);
			url =  app + "/" + model + "/" + id + "/"
			this._render(app, model, "edit", {
				url_prefix: app + "/" + model,
				type: "update",
				model_id: id
			});
		},

		_render: function(app, model, view, options) {
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

