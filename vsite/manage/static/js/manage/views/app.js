define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/app.html'
], function($, _, Backbone, app_template) {
	var AppView = Backbone.View.extend({
		el: $("body"),

		events: {
			"mouseover #global-header .menu li.menu-item": "mouse_in_menu",
			"mouseout #global-header .menu li.menu-item": "mouse_out_menu"
		},

		initialize: function() {
			$("#global-header").width($("#main").width());
		},

		mouse_in_menu: function(e) {
			$(e.target).parent("li").addClass("current");
		},

		mouse_out_menu: function(e) {
			$(e.target).parent("li").removeClass("current");
		}
	});
	return AppView;
});
