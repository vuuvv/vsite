require.config({
	paths: {
		jquery: '../libs/jquery/jquery-min',
		plugins: '../plugins',
		underscore: '../libs/underscore/underscore',
		backbone: '../libs/backbone/backbone',
		text: '../libs/require/text'
	}
});

require(['jquery', 'underscore', 'backbone', "views/list", "views/edit", "plugins"],

function($, _, Backbone, ListView, EditView) {
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
			":app/:model/p/:page": "list"
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
			this.list("page");
		},

		list: function(app, model, page) {
			page = parseInt(page);
			page = page || 0;
			model = norm_model(model);
			var view = new ListView(app, model, page);
			view.render();
		},

		add: function(app, model) {
			model = norm_model(model);
			var view = new EditView({
				app_label: app,
				model_name: model,
				type: "add"
			});
			view.render();
		},

		remove: function(app, mdoel, id) {
		},

		update: function(app, model, id) {
			// tell if id is  integer
			model = norm_model(model);
			var view = new EditView({
				app_label: app,
				model_name: model,
				type: "update",
				model_id: id
			});
			view.render();
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

