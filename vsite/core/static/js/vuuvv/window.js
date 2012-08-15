define(function(require, exports, module) {

require('vuuvv/util');

var WindowManage = function() {
	this._id = 0;
	this._zindex = 99;
	this._windows = {}
	$(window).bind("resize", _.bind(this.on_resize, this));
};

WindowManage.prototype = {
	add: function(win) {
		win.id = win.type + "_" + this._id;
		this._id++;
	},

	del: function(win) {
	},

	active: function(win) {
		this._zindex++;
		win.active(this._zindex);
	},

	deactive: function(win) {
	},

	on_resize: function() {
		var _windows = this._windows;
		for (var k in this._windows) {
			var win = _windows[k],
				options = win.options,
				parent = win.parent,
				ph = parent.height(),
				pw = parent.width(),
				pl = parent.offeset().left,
				wrap = win.wrap,
				h = wrap.height(),
				w = wrap.width(),
				offset = wrap.offset(),
				t = offset.top(),
				l = offset.left();

			if (l + w > pw) {
				var left = pw - w - 5;
				if (left < 0) {
					w = pw - 5;
					left = 0;
				}
				if (options.min_width && w < options.min_width) {
					w = options.min_width;
				}
				wrap.width(w);
				wrap.offset({
					left: left
				});
			}
			if (t + h > ph) {
				var top = ph - h - 5;
				if (top < 0) {
					h = ph - 5;
					top = 0;
				}
				if (options.min_height && w < options.min_height) {
					h = options.min_height;
				}
				wrap.width(w);
				wrap.offset({
					left: left
				});
			}
		}
	}
};

var manage = new WindowManage();

resizes = ["t", "r", "b", "l", "rt", "rb", "lt", "lb"];

Window = function(options) {
	options = options || {};
	this.options = $.extend({}, this.defaults, options);
	this._initialized = false;
};

Window.prototype = {
	type: "window",

	defaults: {
		title: "",
		resizable: true,
		draggable: true,
		parent: $(document.body)
	},

	open: function() {
		if (!this._initialized)
			this.create();
		this.wrap.show();
		manage.active(this);
	},

	create: function() {
		var options = this.options;

		manage.add(this);
		var wrap = this.wrap = $(Util.template("window", {
			id: this.id,
			shadow: ""
		}));
		wrap.append($(Util.template("resize", {
			resizes: resizes
		})));

		var inner = this.inner = wrap.find("#" + this.id + "_inner");
		inner.append($(Util.template("window_title", {
			title: options.title
		})));

		options.parent.append(this.wrap);

		if (options.draggable) {
			wrap.draggable({
				handle: ".dialog-title"
			});
		}

		this._initialized = true;
	},

	action: function(cmd) {
		this[cmd]();
	},

	hide: function() {
		this.wrap.hide();
		manage.deactive(this);
	},

	max: function() {
	},

	restore: function() {
	},

	close: function() {
		manage.del(this.id);
		this.wrap && this.wrap.hide();
		self.max_state = false;
	},

	active: function(zindex) {
		this.wrap.css({
			zIndex: zindex
		}).addClass("window-current");
	},

	deactive: function() {
		this.wrap.removeClass("window-current");
	}
};

if (!window.vuuvv) {
	window.vuuvv = {};
}

vuuvv.window = function(options) {
	return new Window(options);
};

});
