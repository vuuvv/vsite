define([
	'jquery',
	'underscore'
], function($, _) {

"use strict"; // jshint ;_;

var create_or_call = function($dom, name, option, args, cls) {
	return $dom.each(function() {
		var $this = $(this),
			data = $this.data(name),
			options = typeof option == 'object' && option;
		if (!data) // object not created, now create
			$this.data(name, (data = new cls(this, options)));
		if (typeof option == 'string') // call method
			data[option].apply(data, Array.prototype.slice.call(args, 1));
	});
}


/* NOTIFY CLASS DEFINITION
* ====================== */

var dismiss = '[data-dismiss="notify"]';

var Notify = function (elem, options) {
	var $elem = this.$elem = $(elem), 
		defaults = $.fn.notify.defaults || {};
	options = this.options = $.extend({}, defaults, options);
	$elem.on('click', dismiss, _.bind(this.on_close, this));
	this.$msg = $elem.find(".notify-msg");
};

Notify.prototype.on_close = function (e) {
	e && e.preventDefault();
	this.close();
};

Notify.prototype.close = function () {
	var $elem = this.$elem;
	clearTimeout(this.timer);
	$elem.removeClass('in');
	var _remove = function() {
		$elem.trigger('closed').hide()
	};
	$.support.transition && $elem.hasClass('fade') ?
		$elem.on($.support.transition.end, removeElement) :
		_remove()
};

Notify.prototype.show = function (duration) {
	var self = this;
	clearTimeout(this.timer);
	this.$elem.trigger("shown").show();
	if (_.isNumber(duration)) {
		this.timer = setTimeout(function() {
			self.close();
		}, duration);
	}
};

Notify.prototype.msg = function (msg, type, duration) {
	type = type || info;
	var cls = "notify-" + type;
	this.$msg.text(msg);
	this.$elem.removeClass("notify-info notify-error notify-success notify-warning");
	this.$elem.addClass(cls);
	this.show(duration);
};

Notify.prototype.info = function (msg, duration) {
	this.msg(msg, "info", duration);
};

Notify.prototype.error = function (msg, duration) {
	this.msg(msg, "error", duration);
};

Notify.prototype.success = function (msg, duration) {
	this.msg(msg, "success", duration);
};

Notify.prototype.warning = function (msg, duration) {
	this.msg(msg, "warning", duration);
};

/* NOTIFY PLUGIN DEFINITION
* ======================= */

$.fn.notify = function (option) {
	return create_or_call(this, "notify", option, arguments, Notify);
};

$.fn.notify.Constructor = Notify;

$.fn.notify.defaults = {
	duration: 2000
};

/* DIALOG CLASS DEFINITION
* ====================== */
var Dialog = function (elem, options) {
	var $elem = this.$elem = $(elem), 
		defaults = $.fn.dialog.defaults || {};
	options = this.options = $.extend({}, defaults, options);
};

Dialog.prototype = {
	show: function() {
		var dialog = $('<div class="dialog"></div>');
		var head = $('<div></div>');
		var body = $('<div></div>');
		var footer = $('<div></div>');
	},

	hide: function() {
	},

	close: function() {
	},

	destroy: function() {
	}

};


/* DIALOG PLUGIN DEFINITION
* ======================= */

$.fn.dialog = function (option) {
	return create_or_call(this, "dialog", option, arguments, Dialog);
};

$.fn.dialog.defaults = {
	width: 400,
	height: 300,
	dragable: true,
	modal: false
};

});


