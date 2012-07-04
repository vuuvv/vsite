require.config({
	paths: {
		jquery: '../libs/jquery/jquery-min',
		underscore: '../libs/underscore/underscore',
		backbone: '../libs/backbone/backbone',
		text: '../libs/require/text'
	}
});

require(['jquery', 'underscore', 'backbone', "views/model"],

function($, _, Backbone, ModelView) {
	var custom_views = ["page"];

	var ManageApp = Backbone.Router.extend({
		routes: {
			"add/:model": "add",
			"update/:model": "update",
			":model": "list",
			":model/*page": "list"
		},

		initialize: function(options) {
		},

		list: function(model, page) {
			page = parseInt(page);
			page = page || 0;
			view = unescape(model).replace(/[ -]+/g, "_");
			if (custom_views.indexOf(view) == -1) {
				new ModelView(model);
			} else {
				require(['views/' + view], function(view_cls) {
					new view_cls;
				});
			}
		},

		add: function(model) {
			console.log("add");
		},

		update: function(model) {
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


