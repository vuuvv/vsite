!function($) {

"use strict"; // jshint ;_;

var Accordion = function(element, options) {
	var $element = this.$element = $(element),
		heads_length = 0;
	this.options = $.extend({}, $.fn.accordion.defaults, options);
	if (!$element.hasClass('accordion'))
		$element.addClass('accordion');
	this.$groups = $element.find('.accordion-group').each(function(index, elem) {
		var $e = $(elem);
		$e.data('index', index).addClass("static");
		heads_length += $e.height();
	});
	this.heads_length = heads_length;
	this.show($element.find('>.accordion-group:first-child').data('index'));
};

Accordion.prototype = {
	constructor: Accordion,

	_body_height: function() {
		return this.$element.height() - this.heads_length;
	},

	show: function(index) {
		var group = $(this.$groups[index]),
			active = this.$element.find('> .accordion-group.shown'),
			head = group.find(".accordion-heading"),
			body = group.find(".accordion-body");

		if (group.hasClass("shown"))
			return;

		if (active) {
			active.removeClass("shown");
			active.removeClass("static");
			active.find(".accordion-body").animate({height: 0}, function(){
				active.addClass("static");
			});
		}

		group.addClass("shown");
		group.removeClass("static");
		body.animate({
			height: this._body_height()
		}, function() {
			group.addClass("static");
		});
	},

	_show_body: function(body) {
	},

	toggle: function(index) {
		this.show(index);
	}
};

/* PLUGIN DEFINITION */
$.fn.accordion  = function(option) {
	var args = arguments;
	return this.each(function() {
		var $this = $(this),
			data = $this.data('accordion'),
			options = typeof option == 'object' && option;
		if (!data) 
			$this.data('accordion', (data = new Accordion(this, options)));
		if (typeof option == 'string') 
			data[option].apply(data, Array.prototype.slice.call(args, 1));
	});
};

$.fn.accordion.defaults = {
	toggle: true
};

$.fn.accordion.Constructor =  Accordion;

$(function() {
	$('body').on('click.accordion.data-api', '[data-toggle=accordion]', function(e) {
		var $this = $(this),
			$target = $this.parents('.accordion');
		e.preventDefault();
		$target.accordion('toggle', $this.parents('.accordion-group').data('index'));
	});
});

}(jQuery);
