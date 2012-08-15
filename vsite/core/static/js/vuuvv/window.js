define(function(require, exports, module) {

require('vuuvv/util');

var WindowManage = function() {
	this._windows = {}
	$(window).bind("resize", _.bind(this.on_resize, this));
};

WindowManage.prototype = {
	add: function(win) {
		win.id = "window_0";
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
	this.create();
};

Window.prototype = {
	defaults: {
		title: "",
		resizable: true,
		draggable: true,
		type: "window",
		parent: $(document.body)
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
	}
};

if (!window.vuuvv) {
	window.vuuvv = {};
}

vuuvv.window = function(options) {
	return new Window(options);
};

});
