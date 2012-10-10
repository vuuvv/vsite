(function() {

var SlideShow = function(options) {
	this.initialize(options);
};

SlideShow.prototype = {
	defaults: {
		interval: 4000
	},

	initialize: function(options) {
		var opts = this.options = $.extend({}, this.defaults, options);
		this.element = $(opts.element);
		this.listen();
		this.arrange();
		this.current = 0;
		this.current_group = 0;
		this.timer = null;
		this.pause = true;
	},

	bind: function(method) {
		var self = this;
		return function() {
			self[method].apply(self, arguments);
		};
	},

	dom: function(selector) {
		return this.element.find(selector);
	},

	arrange: function() {
		var count = 0;
		var lookup = this.lookup = [];
		$(".slideshow_thumbs_wrapper").each(function(index, elem) {
			$(elem).find(".slideshow_thumb").each(function(i, el) {
				$(el).attr('index', count++);
			});
			lookup.push(count);
		});
	},

	locate_thumb: function(index) {
		var lookup = this.lookup;
		for (var i = 0, len = lookup.length; i < len; i++) {
			if (index < lookup[i]) {
				return {
					group: i,
					index: index - lookup[i - 1]
				}
			}
		}
		// over flow
		return null;
	},

	listen: function() {
		var dispatch = {
			'#slideshow_play_toggle:click': 'on_toggle_play',
			'.slideshow_next:click': 'on_next',
			'.slideshow_prev:click': 'on_prev',
			'.slideshow_grid:click': 'on_show_grid',
			'.slideshow_thumb_close:click': 'on_hide_grid'
		};
		this.mouse_event();
		for (var evt in dispatch) {
			var parts = evt.split(":");
			this.dom(parts[0]).bind(parts[1], this.bind(dispatch[evt]));
		}
	},

	mouse_event: function() {
		this.element.unbind('mouseenter')
					.bind('mouseenter', this.bind('show_controls'))
					.andSelf()
					.unbind('mouseleave')
					.bind('mouseleave', this.bind('hide_controls'));
	},

	play: function() {
		this.show_image(this.current);
		$('#slideshow_pause_play').addClass('slideshow_pause').removeClass("slideshow_play");
		this.timer = setInterval(this.bind("next"), this.opts.interval);
	},

	pause: function() {
		$('#slideshow_pause_play').addClass('slideshow_play').removeClass("slideshow_pause");
		this.timer = clearTimeout(this.timer);
	},

	next: function() {
		this.show_image(this.current + 1);
	},

	prev: function() {
		this.show_image(this.current - 1);
	},

	find_group: function(index) {
		return this.dom(".slideshow_thumbs_wrapper:nth-child(" + index + ")");
	},

	find_thumb: function(group, index) {
		return group.find(".slideshow_thumb:nth-child(" + index + ")");
	},

	select_group: function(index) {
		var current = this.current_group;
		if (current != index) {
			this.current_group = index;
			this.find_group(current).hide();
			return this.find_group(index).show();
		}
		return this.find_group(current);
	},

	select_thumb: function(index) {
		var loc = this.locate_thumb(index) || {group: 0, index: 0};
		var group = this.select_group(loc.group);
		var thumb = this.find_thumb(group, loc.index);
		this.current = loc.index;
		return thumb;
	},

	load_img: function(src) {
		$('<img/>').load(function() {
			var $this = $(this);
		});
	},

	resize_img: function(src_img, container_width, container_height) {
		var image = new Image();
		image.src = src_img.attr("src");
		var w = image.width;
		var h = image.height;
		var width = w, height = h;
		if (w > container_width) {
			width = container_width;
			var scale = container_width / w;
			height = h * scale;
			if (height > container_height) {
				height = container_height;
				width = w * container_height / h;
			}
		} else if (h > container_height) {
			height = container_height;
			width = w * container_height / h;
		}
		src_img.css({
			'width': width,
			'height': height
		});
	},

	show_image: function(index) {
		var thumb = this.select_thumb(index);
		var src = thumb.attr('href');
		var wrapper = $('#slideshow_wrapper');
		var img = wrapper.find('img');
		var self = this;
		var on_load = function() {
			var image = $(this);
			self.resize(image);
			image.hide();
			wrapper.empty().append(image.fadeIn());
		};
		if (img.length) {
			img.fadeOut(function() {
				$(this).remove();
				$('<img />').load(on_load).attr('src', src);
			});
		} else {
			$('<img />').load(on_load).attr('src', src);
		}
	},

	show_grid: function() {
		this.hide_controls();
		this.element.unbind('mouseenter').unbind('mouseleave');
		this.pause();
		this.dom('.slideshow_thumbs').stop().animate({'top': '0'}, 500);
	},

	hide_grid: function(e) {
		this.show_controls();
		this.mouse_event();
		this.dom('.slideshow_thumbs').stop().animate({'top': '-230px'}, 500);
	},

	show_controls: function() {
		this.dom('.slideshow_controls').stop().animate({'right': '15px'}, 500);
	},

	hide_controls: function() {
		this.dom('.slideshow_controls').stop().animate({'right': '-110px'}, 500);
	},

	on_toggle_play: function(e) {
		if (this.pause) {
			this.play();
			this.pause = false;
		} else {
			this.pause();
			this.pause = true;
		}
		e.preventDefault();
		return false;
	},

	on_show_grid: function(e) {
		this.show_grid();
		e.preventDefault();
		return false;
	},

	on_hide_grid: function(e) {
		this.hide_grid();
		e.preventDefault();
		return false;
	}
};

window.SlideShow = SlideShow;

}());
