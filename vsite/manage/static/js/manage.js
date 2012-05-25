(function(window) {

var View = Backbone.View,
	Model = Backbone.Model,
	Collection = Backbone.Collection,
	Router = Backbone.Router;

var User = Model.extend();
var UserList = Collection.extend({
	model: User
});

var AsyncView = View.extend({
	template: null,
	render: function(event) {
		var self = this;
		if (this.template) {
			self._render(template)
		} else {
			$.ajax({
				url: 'template/' + self.name,
				success: function(template) {
					self.template = template;
					self._render();
				}
			});
		}
	}
});

var LoginView = View.extend({
});

var MainView = AsyncView.extend({
	name: 'main',
	el: $('body'),

	initialize: function() {
		this.render();
	},

	_render: function(template) {
		this.$el.html(template);
		$('#manage-accord, #content').height($('body').height() - 36 - 2);
		var accordions = new Accordions();
		new AccordionView({
			el: $("#manage-accord"),
			model: accordions
		});
		accordions.fetch();
	}
});

var Accordions = Collection.extend({
	url: "accordion"
});

var AccordionView = AsyncView.extend({
	name: 'accordion',

	initialize: function() {
		this.model.bind("reset", this.render, this);
	},

	_render: function() {
		this.$el.html(_.template(this.template, {accordions:this.model}));
		$("#manage-accord").accordion();
	}
});

var FormView = View.extend({
});

var AppRouter = Router.extend({
	routes: {
		"": "welcome",
		"test": "test"
	},

	welcome: function() {
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
