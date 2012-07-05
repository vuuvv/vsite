require.config({
	paths: {
		jquery: '../libs/jquery/jquery-min',
		underscore: '../libs/underscore/underscore',
		backbone: '../libs/backbone/backbone',
		text: '../libs/require/text'
	}
});

require(['jquery', 'underscore', 'backbone', "views/list", "views/edit"],

function($, _, Backbone, ListView, EditView) {
	var custom_views = ["page"];

	var norm_model = function(model) {
		return unescape(model).toLowerCase().replace(/[ -]+/g, "_");
	};

	var ManageApp = Backbone.Router.extend({
		routes: {
			"": "index",
			"logout": "logout",
			"add/:model": "add",
			"update/:model/:id": "update",
			":model": "list",
			":model/*page": "list"
		},

		initialize: function(options) {
		},

		logout: function() {
		},

		index: function() {
			this.list("page");
		},

		list: function(model, page) {
			page = parseInt(page);
			page = page || 0;
			model = norm_model(model);
			var view = new ListView(model, page);
			view.render();
		},

		add: function(model) {
			model = norm_model(model);
			var view = new EditView({
				model_name: model,
				type: "add"
			});
			view.render();
		},

		update: function(model, id) {
			model = norm_model(model);
			var view = new EditView({
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


