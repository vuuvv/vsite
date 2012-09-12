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
		action: "document/add",
		label: "新建文档"
	}, {
		class_name: "vui-doc-list vui-blue-button",
		action: "document",
		label: "文档列表"
	}],
	nav_items: [{
		label: "会员管理",
		action: "",
		children: [{
			label: "会员用户",
			action: ""
		}, {
			label: "会员分组",
			action: ""
		}, {
			label: "会员授权",
			action: ""
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
		});
	},

	trigger: function(jdom) {
		if (jdom.hasClass("expanded")) {
			jdom.removeClass("expanded");
		} else {
			jdom.addClass("expanded");
		}
		return false;
	}
};

inherits(SideBarTree, VUI.Widget, ManageWidget);

});
