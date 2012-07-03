define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/app.html'
], function($, _, Backbone, app_template) {
	var AppView = Backbone.View.extend({
		el: $("body"),

		initialize: function() {
			$("#global-header").width($("#main-body").width());
			$("#global-header .menu li.menu-item").hover(function() {
				$(this).addClass("current");
			}, function(){
				$(this).removeClass("current");
			});
		}
	});
	return AppView;
});
