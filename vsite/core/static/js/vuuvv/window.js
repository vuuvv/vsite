define(function(require, exports, module) {

require('vuuvv/util');

var template = Util.template;

if (!window.vuuvv) {
	window.vuuvv = {};
}

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
		this._windows[win.id] = win;
	},

	del: function(win) {
	},

	active: function(win) {
		if (win.is_active())
			return;
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
				parent = options.parent,
				ph = parent.height(),
				pw = parent.width(),
				pl = parent.offset().left,
				wrap = win.wrap,
				h = wrap.height(),
				w = wrap.width(),
				offset = wrap.offset(),
				t = offset.top,
				l = offset.left;

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

Window = function(options) {
	options = options || {};
	this.options = $.extend({}, this.defaults, options);
	this._initialized = false;
	this.is_max = false;
};

Window.prototype = {
	type: "window",

	defaults: {
		title: "",
		content: "",
		resizable: true,
		draggable: true,
		minable: true,
		open_in_max: false,
		parent: $(document.body)
	},

	open: function() {
		if (!this._initialized)
			this.create();
		this.wrap.show();
		manage.active(this);
	},

	create: function() {
		var options = this.options,
			self = this,
			parent = options.parent;

		manage.add(this);
		var wrap = this.wrap = $(template("window", {
			id: this.id,
			shadow: ""
		}));

		var inner = this.inner = wrap.find("#" + this.id + "_inner");
		var title = this.title = $(template("window_title", {
			title: options.title
		}));

		title.find("[btn]").mousedown(function(e) {
			Util.stop_propagation(e);
			manage.active(self);
		}).click(function(e) {
			var cmd = $(this).attr("btn");
			self[cmd]();
		});

		inner.append(title);

		if (options.width != undefined) {
			wrap.width(options.width);
		}

		if (options.height != undefined) {
			wrap.heigth(options.height);
		}

		parent.append(this.wrap);

		if (wrap.height() > parent.height()) {
			wrap.height(parent.height());
		}

		if (options.draggable) {
			wrap.draggable({
				handle: ".dialog-title",
				containment: "parent"
			});
		}

		if (options.position) {
			wrap.css(options.position);
		} else {
			Util.center(wrap, {parent: parent});
		}

		if (options.resizable) {
			wrap.resizable({
				minWidth: 150,
				minHeight: 50 
			});
		} else {
			title.find("[btn='max'], [btn='restore']").remove();
		}

		if (!options.minable) {
			title.find("[btn='hide']").remove();
		}

		var frame = $('<div class="window-frame"></div>');
		frame.append(options.content);
		inner.append(frame);

		if (options.open_in_max) {
			max();
		}

		this._set_title_btn();

		this._initialized = true;
	},

	hide: function() {
		this.wrap.hide();
		manage.deactive(this);
	},

	_set_title_btn: function() {
		if (this.options.resizable) {
			if (this.is_max) {
				this.title.find("[btn='max']").hide();
				this.title.find("[btn='restore']").show();
			} else {
				this.title.find("[btn='restore']").hide();
				this.title.find("[btn='max']").show();
			}
		}
	},

	is_active: function() {
		return this.wrap.hasClass("window-current");
	},

	trigger_max: function() {
		if (this.is_max) {
			this.restore();
		} else {
			this.max();
		}
	},

	max: function() {
		var parent = this.options.parent,
			pw = parent.width(),
			ph = parent.height(),
			wrap = this.wrap,
			offset = wrap.offset();
		this.is_max = true;
		this._old_position = {
			w: wrap.width(),
			h: wrap.height(),
			t: offset.top,
			l: offset.left
		}
		wrap.width(pw).height(ph).css({
			top: 0,
			left: 0
		});
		this._set_title_btn();
	},

	restore: function() {
		this.is_max = false;
		var opts = this.options,
			wrap = this.wrap;
		if (this._old_position) {
			console.log(this._old_position);
			var p = this._old_position;
			wrap.width(p.w).height(p.h).css({
				top: p.t,
				left: p.l
			});
		} else {
			wrap.width(opts.width).height(opts.height);
			Util.center(wrap, {parent: parent});
		}
		this._set_title_btn();
	},

	close: function() {
		manage.del(this.id);
		this.wrap.remove();
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

vuuvv.window = function(options) {
	return new Window(options);
};

var Message = function(options) {
	options = options || {};
	this.options = $.extend({}, this.defaults, options);
};

Message.prototype = {
	defaults: {
		text: "",
		type: "ok"
	},

	cls: {
		ok: "hint-icon hint-ok-m",
		war: "hint-icon hint-war-m",
		err: "hint-icon hint-err-m",
		load: "hint-loader",
		inf: "hint-icon hint-inf-m"
	},

	create: function() {
		var options = this.options,
			cls = this.cls,
			dom = this.dom = $(template("min_message", {text: options.text})),
			icon = dom.find("[rel='type]");

		for (var k in cls) {
			icon.removeClass(cls[k]);
		}
		icon.addClass(cls(options.type));
	},

	show: function(options) {
	},

	hide: function() {
		if (this.timer)
			window.clearTimeout(this.timer);
		if (this.dom)
			this.dom.hide();
	}
};

});
