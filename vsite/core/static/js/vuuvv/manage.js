define(function(require, exports, module) {

require('vuuvv/vuuvv');

var inherits = vuuvv.inherits;
var utils = vuuvv.utils;

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
	}
};

inherits(Dashboard, VUI.Widget, ManageWidget);

});
