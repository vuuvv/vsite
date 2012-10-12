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
		this.paused = true;
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
		var thumbs = $(".slideshow_thumbs_wrapper");
		thumbs.each(function(index, elem) {
			$(elem).find(".slideshow_thumb").each(function(i, el) {
				$(el).attr('index', count++);
			});
			lookup.push(count);
		});
		this.total = count;
		this.total_group = thumbs.length;
	},

	locate_thumb: function(index) {
		var lookup = this.lookup;
		for (var i = 0, len = lookup.length; i < len; i++) {
			if (index < lookup[i]) {
				return {
					group: i,
					index: i == 0 ? index : index - lookup[i - 1]
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
			'.slideshow_thumb:click': 'on_click_thumb',
			'.slideshow_thumb:mouseenter': 'on_hover_thumb',
			'.slideshow_thumb:mouseout': 'on_blur_thumb',
			'.slideshow_thumb_next:click': 'on_next_thumb',
			'.slideshow_thumb_prev:click': 'on_prev_thumb',
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

	start: function() {
		this.show_image(this.current);
		this.play();
	},

	_start_timer: function() {
		this.timer = setInterval(this.bind("next"), this.options.interval);
	},

	_clear_timer: function() {
		this.timer = clearTimeout(this.timer);
	},

	play: function() {
		this._clear_timer();
		this.paused = false
		$('#slideshow_play_toggle').addClass('slideshow_pause').removeClass("slideshow_play");
		this._start_timer();
	},

	pause: function() {
		this.paused = true;
		$('#slideshow_play_toggle').addClass('slideshow_play').removeClass("slideshow_pause");
		this._clear_timer();
	},

	_tune_index: function(index) {
		var i = index % this.total;
		return i < 0 ? this.total + i : i;
	},

	next: function() {
		this.show_image(this._tune_index(this.current + 1));
	},

	prev: function() {
		this.show_image(this._tune_index(this.current - 1));
	},

	find_group: function(index) {
		return this.dom(".slideshow_thumbs_wrapper:nth-child(" + (index + 1) + ")");
	},

	find_thumb: function(group, index) {
		return group.find(".slideshow_thumb:nth-child(" + (index + 1) + ")");
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
		this.current = index;
		return thumb;
	},

	_check_prev_next: function(index) {
		var prev = $("#slideshow_thumb_prev").show();
		var next = $("#slideshow_thumb_next").show();
		if (index == 0) {
			prev.hide();
		}
		if (index == this.total_group - 1) {
			next.hide();
		}
	},

	switch_group: function(index) {
		var now = this.find_group(this.current_group);
		var target = this.find_group(index);
		var self = this;
		now.fadeOut(function() {
			self.current_group = index;
			self._check_prev_next(index);
			target.fadeIn();
		});
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
		this._show_image(src);
	},

	_show_image: function(src) {
		var wrapper = $('#slideshow_wrapper');
		var img = wrapper.find('img');
		var self = this;
		var on_load = function() {
			var image = $(this);
			self.resize_img(image, 400, 400);
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
		//this.current = index;
	},

	show_grid: function() {
		this.hide_controls();
		this.element.unbind('mouseenter').unbind('mouseleave');
		this._check_prev_next(this.current_group);
		this.dom('.slideshow_thumbs').stop().animate({'top': '0'}, 500);
	},

	hide_grid: function() {
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
		if (this.paused) {
			this.play();
		} else {
			this.pause();
		}
		e.preventDefault();
		return false;
	},

	on_next: function(e) {
		this._clear_timer();
		this.next();
		this._start_timer();
		e.preventDefault();
		return false;
	},

	on_prev: function(e) {
		this._clear_timer();
		this.prev();
		this._start_timer();
		e.preventDefault();
		return false;
	},

	on_show_grid: function(e) {
		this.show_grid();
		this.pause();
		e.preventDefault();
		return false;
	},

	on_hide_grid: function(e) {
		this.hide_grid();
		this.play();
		e.preventDefault();
		return false;
	},

	on_next_thumb: function(e) {
		this.switch_group(this.current_group + 1);
		e.preventDefault();
		return false;
	},

	on_prev_thumb: function(e) {
		this.switch_group(this.current_group - 1);
		e.preventDefault();
		return false;
	},

	on_click_thumb: function(e) {
		var thumb = $(e.currentTarget);
		var src = thumb.attr("href");
		this.current = thumb.attr("index");
		this._show_image(src);
		return this.on_hide_grid(e);
	},

	on_hover_thumb: function(e) {
		$(e.currentTarget).stop().animate({'opacity': 1});
	},

	on_blur_thumb: function(e) {
		$(e.currentTarget).stop().animate({'opacity': 0.5});
	}
};

window.SlideShow = SlideShow;

}());
