define(function(require, exports, module) {

require('vuuvv/vuuvv');

var inherits = vuuvv.inherits;
var utils = vuuvv.utils;
var Button = VUI.Button;

var ui_template = utils.template(require('vuuvv/templates/manage.html'));

var ManageWidget = VUI.ManageWidget = {
	get_render_html: function() {
		return ui_template[this.template](this);
	}
};

var Dashboard = VUI.Dashboard = function(options) {
	this.initialize(options);
};

Dashboard.prototype = {
	name: 'dashboard',

	on_postrender: function() {
		var sidebar = new VUI.SideBar();
		sidebar.render(this.get_dom("sidebar"));
		var tabview = this.tabview = new VUI.TabView();
		tabview.render(this.get_dom("content"));
		var notify = this.notify = new VUI.Notify();
		notify.render();
	},

	open_page: function(path) {
		var page;
		var parts = path.split("~");
		var id = parts[1];
		if (id) {
			page = this.tabview.find_page_by_id(id);
			if (page) {
				this.select_page(page);
				return;
			} else
				path = parts[0];
		}
		var self = this;
		$.ajax(path, {
			dataType: "json",
			success: function(data) {
				self.on_success(path, data);
			},
			error: utils.bind(this.on_fail, this)
		});
		this.info("载入数据...");
	},

	on_success: function(path, data) {
		var page;
		if (data.find_tab) {
			page = this.tabview.find_page_by_action(path);
		}
		if (page) {
			this.select_page(page);
		} else {
			data.action = path;
			page = this.create_list_page(data);
		}
		this.success("数据载入完毕", true);
	},

	create_list_page: function(data) {
		var page = new VUI.TabPage({
			action: data.action
		});
		this.add_page(data.label, page);
		var table = new VUI.Table({
			columns: data.columns,
			items: data.items
		});
		page.set_content(table);
	},

	create_form_page: function(data) {
	},

	on_fail: function(data) {
		this.error(data.statusText);
	},

	add_page: function(path, page) {
		this.tabview.append(path, page);
		this.tabview.select(page, true);
	},

	select_page: function(page) {
		this.tabview.select(page);
	},

	info: function(msg, is_flash) {
		this.notify.info(msg, is_flash);
	},

	error: function(msg, is_flash) {
		this.notify.error(msg, is_flash);
	},

	warning: function(msg, is_flash) {
		this.notify.warning(msg, is_flash);
	},

	success: function(msg, is_flash) {
		this.notify.success(msg, is_flash);
	}
};

inherits(Dashboard, VUI.Widget, ManageWidget);

var SideBar = VUI.SideBar = function(options) {
	this.initialize(options);
};

SideBar.prototype = {
	name: "sidebar",
	header_btns: [{
		class_name: "vui-new-doc vui-blue-button",
		action: "document/article/add/",
		label: "新建文档"
	}, {
		class_name: "vui-doc-list vui-blue-button",
		action: "document/article/",
		label: "文档列表"
	}],
	nav_items: [{
		label: "会员管理",
		action: "",
		children: [{
			label: "会员",
			action: "user"
		}, {
			label: "会员分组",
			action: "user_group"
		}, {
			label: "会员授权",
			action: "auth"
		}]
	}, {
		label: "页面管理",
		action: "",
		children: []
	}, {
		label: "新闻管理",
		action: "",
		children: []
	}, {
		label: "产品管理",
		action: "",
		children: []
	}, {
		label: "系统管理",
		action: "",
		children: []
	}],

	on_postrender: function() {
		var header = this.get_dom("header");
		var btns = this.header_btns; 
		for (var i = 0, len = btns.length; i < len; i++) {
			var btn = new Button(btns[i]);
			btn.render(header);
		}
		var tree = new SideBarTree({items: this.nav_items});
		tree.render(this.get_dom("body"));
	}
};

inherits(SideBar, VUI.Widget, ManageWidget);

var SideBarTree = VUI.SideBarTree = function(options) {
	this.initialize(options);
};

SideBarTree.prototype = {
	name: "sidebartree",

	on_postrender: function() {
		var self = this;
		$(".vui-sidebartree-root-label").click(function(evt) {
			self.trigger($(this).parent());
			return false;
		});
	},

	trigger: function(jdom) {
		if (jdom.hasClass("expanded")) {
			jdom.removeClass("expanded");
		} else if (jdom.find("ul").length) {
			jdom.addClass("expanded");
		}
	}
};

inherits(SideBarTree, VUI.Widget, ManageWidget);

var Notify = VUI.Notify = function(options) {
	this.initialize(options);
};

Notify.prototype = {
	name: "notify",
	fade: true,
	duration: 2000,

	on_postrender: function() {
		var self = this;
		$(this.get_dom("close")).click(function() {
			self.hide();
		});
	},

	show: function(duration) {
		var self = this;
		var box = this.$elem;
		clearTimeout(this.timer);
		box.show();
		var pos = this.center_pos($("body"));
		box.css({left: pos.left});

		if (_.isNumber(duration)) {
			this.timer = setTimeout(function() {
				self.hide();
			}, duration);
		}
	},

	hide: function() {
		var box = this.$elem;
		clearTimeout(this.timer);
		box.hide();
	},

	msg: function(msg, type, is_flash) {
		type = type || "info";
		var box = this.$elem;
		$(this.get_dom("text")).text(msg);
		box.removeClass("notify-info notify-error notify-success notify-warning");
		box.addClass("notify-" + type);
		this.show(is_flash ? this.duration : null);
	},

	info: function(msg, is_flash) {
		this.msg(msg, "info", is_flash);
	},

	error: function(msg, is_flash) {
		this.msg(msg, "error", is_flash);
	},

	warning: function(msg, is_flash) {
		this.msg(msg, "warning", is_flash);
	},

	success: function(msg, is_flash) {
		this.msg(msg, "success", is_flash);
	}
};

inherits(Notify, VUI.Widget, ManageWidget);

var Table = VUI.Table = function(options) {
	this.initialize(options);
};

Table.prototype = {
	name: "table",
	columns: null,
	items: null,

	on_postrender: function() {
	},

	set_data: function(data) {
	}
};

inherits(Table, VUI.Widget, ManageWidget);

});
