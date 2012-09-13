define(function(require, exports, module) {
	require('vuuvv/manage');

	var norm_model = function(model) {
		return unescape(model).toLowerCase().replace(/[ -]+/g, "_");
	};

	var ManageApp = Backbone.Router.extend({
		filebrowser: null,

		routes: {
			"": "index",
			"*path": "dispatch"
			/*
			"logout": "logout",
			"filemanage": "filemanage",
			"apps": "apps"
			"m/:app/:model/add": "add",
			"m/:app/:model/:id": "update",
			"m/:app/:model": "list",
			"m/:app/:model/p/:page": "list",
			"m/:app/:model/add/:pid": "tree_add",
			"m/:app/:model/:pid/": "tree_list",
			"m/:app/:model/:pid/p/:page": "tree_list"
			*/
		},

		dispatch: function(path) {
			this.dashboard.open_page(path);
		},

		csrf_token: null,

		initialize: function(options) {
			var dashboard = this.dashboard = new VUI.Dashboard();
			dashboard.render($("body")[0]);
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
			/*
			var win = vuuvv.window({
				title: "Hello World",
				content: "<h1>Hello World</h1><h1>Hello World</h1><h1>Hello World</h1>",
				minable: false,
				resizable: true
			});
			win.open();
			var w = new VUI.Popup({content: "abcdefg"});
			w.show(100, 100);
			$("#vui_fixedlayer").append("<div id='test' class='vui-popup vui-popup' style='left: 300px'><div class='vui-shadow' style=''></div><div class='vui-popup-content'>1234</div></div>");
			$(document).click(function(evt) {
				$(".vui-shadow").each(function() {
					$(this).height(260);
					$(this).width(100);

					//alert($(this).width() + "," + $(this).height());
				});
				w.move_to(evt.clientX, evt.clientY);
				$("#test").css({
					left: evt.clientX,
					top: evt.clientY
				});
				alert(document.getElementById("test").clientHeight);
			});
			var w = new VUI.Menu({
				items: [
					{label: "全选"},
					{label: "清空文档"},
					{label: "段落"},
					"-",
					{label: "Clear"}
				]
			});
			w.show();
			$(document).on('contextmenu', function(evt) {
				w.show(evt.clientX, evt.clientY);
				return false;
			});
			*/
		}
	});

	VUI.App = new ManageApp;
	Backbone.history.start();
});
