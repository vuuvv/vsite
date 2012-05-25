(function(window) {

var User = Backbone.Model.extend();
var UserList = Backbone.Collection.extend({
	model: User
});

var AsyncView = Backbone.View.extend({
	render: function(event) {
		var self = this;
		$.ajax({
			url: 'template/' + self.name,
			success: function(data) {
				self._render(data);
			}
		});
	}
});

var LoginView = Backbone.View.extend({
});

var MainView = AsyncView.extend({
	name: 'main',
	el: $('body'),

	initialize: function() {
		this.render();
	},

	_render: function(data) {
		this.$el.html(data);
		$('#manage-accord, #content').height($('body').height() - 36 - 2);
		new AccordionView({
			el: $("#manage-accord")
		});
	}
});

var AccordionView = AsyncView.extend({
	name: 'accordion',

	initialize: function() {
		this.render();
	},

	_render: function(data) {
		this.$el.html(data);
		$("#manage-accord").accordion();
	}
});

var FormView = Backbone.View.extend({
});

var AppRouter = Backbone.Router.extend({
	routes: {
		"": "welcome",
		"test": "test"
	},

	welcome: function() {
		console.log("welcome");
		this.main = new MainView();
	},

	test: function() {
		$("#content").html("test");
	},

	list: function() {
	}
});

var app = new AppRouter();
Backbone.history.start();

}(window));
