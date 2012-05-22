(function(window) {
YUI().use('app', 'handlebars', 'jsonp', 'cssbutton', function(Y) {
	var LoginPageView = Y.Base.create('LoginPageView', Y.View, [], {
		template: Y.Handlebars.compile(Y.one('#t-login').getHTML()),

		events: {
			'input': {
				keypress: 'enter'
			}
		},

		enter: function() {
			console.log("here");
			this.fire('goto_user');
		},

		initializer: function() {
			this.publish('goto_user', {preventable: false});
		},

		render: function() {
			var content = this.template();
			this.get('container').setHTML(content);
			return this;
		}
	});

	var UserPageView = Y.Base.create("UserPageView", Y.View, [], {
		template: Y.Handlebars.compile(Y.one('#t-user').getHTML()),

		render: function() {
			var content = this.template();
			this.get('container').setHTML(content);
			return this;
		}
	});

	var ManageApp = Y.Base.create('ManageApp', Y.App, [], {
		views: {
			login_page: {
				type: LoginPageView
			},
			user_page: {
				type: UserPageView
			}
		},

		initializer: function() {
			this.on('*:goto_user', this.goto_user);
			this.once('ready', function(e) {
				if (this.hasRoute(this.getPath())) {
					this.dispatch();
				} else {
					this.show_home_page();
				}
			});
		},

		goto_user: function() {
			console.log("goto_user");
			this.navigate('/manage/user');
		},

		show_home_page: function(req) {
			console.log("home");
			this.showView('login_page');
		},

		show_user_page: function(req) {
			console.log("user");
			this.showView('user_page');
		}
	}, {
		ATTRS: {
			root: {
				value: "/manage"
			},
			routes: {
				value: [
					{path: '/',			callback: "show_home_page"},
					{path: '/user',		callback: "show_user_page"}
				]
			}
		}
	});
	new ManageApp({
	}).render();
});
}(window));
