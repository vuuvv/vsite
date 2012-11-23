(function() {

	var create_elem = function(elem) {
		var parts = elem.split('.');
		var class_name = parts[1];
		var tag = parts[0] === '' ? 'div' : parts[0];

		elem = document.createElement(tag);
		return $(elem).addClass(class_name);
	}

	var TimelineItem = function(dom) {
		this.src = dom.attr("rel");
		this.info = dom.text();
	};

	var Timeline = function(options) {
		this.initialize(options);
	};

	Timeline.prototype = {
		defaults: {
			container: "#timeline",
			nav_height: 40,
			nav_width: 60
		},

		initialize: function(options) {
			var opts = this.options = $.extend({}, this.defaults, options);
			this.container = $(opts.container);
			this.loaded = {};
			this.items = this.get_items();
			this.build_doms();
			this.bind_events();

			this.show_img(0);
		},

		get_items: function() {
			var items = [];
			this.container.find("li").each(function(i, elem) {
				items.push(new TimelineItem($(elem)));
			});
			return items;
		},

		build_img: function(src) {
			return $("<img>").attr("src", src);
		},

		build_nav_item: function(info) {
			return $("<div>").addClass("timeline-nav-item").text(info);
		},

		build_doms: function() {
			var self = this;
			var opts = this.options;
			var nav_width = opts.nav_width;
			this.wrap = create_elem(".timeline-wrap");
			this.view = create_elem(".timeline-view").appendTo(this.wrap);
			this.image_store = create_elem(".timeline-store").appendTo(this.wrap);
			this.loading = create_elem(".timeline-loading").appendTo(this.view);
			this.img = create_elem("img.timeline-img").appendTo(this.view);

			this.nav_bar = create_elem(".timeline-navbar").appendTo(this.wrap);
			this.nav = create_elem(".timeline-nav").appendTo(this.nav_bar);
			this.nav_prev = create_elem(".timeline-nav-prev").appendTo(this.nav_bar).text("<");
			this.nav_next = create_elem(".timeline-nav-next").appendTo(this.nav_bar).text(">");
			this.total_length = this.items.length * opts.nav_width;
			this.nav_length = this.nav_bar.width();

			$.each(this.items, function(i, item) {
				self.image_store.append(self.build_img(item.src));
				self.build_nav_item(item.info).appendTo(self.nav).css({
					top: 0,
					left: i * nav_width
				});
			});
			this.nav_items = this.nav.find(".timeline-nav-item");
			this.container.replaceWith(this.wrap);
		},

		bind_events: function() {
			var self = this;
			var step = 2 * this.options.nav_width;
			this.nav_next.click(function() {
				var offset = parseInt(self.nav.css("left"));
				var left = offset - step;
				if (-offset >= step)
					left = this.nav_length - this.total_length;
				self.nav.css("left", left);
			});
			this.nav_prev.click(function() {
				var offset = parseInt(self.nav.css("left"));
				if (offset >= -step)
					offset = -step;
				self.nav.css("left", offset + step);
			});
			this.nav_items.each(function(i, elem) {
				$(elem).click(function() {
					self.show_img(i);
				});
			});
		},

		fade_img: function(img, src) {
			img.hide().attr("src", src).fadeIn();
		},

		show_img: function(index) {
			var self = this;

			if (this.current)
				this.current.removeClass("current");
			this.current = this.nav_items.eq(index).addClass("current")

			var data = this.items[index];
			if (data.loaded) {
				this.fade_img(this.img, data.src);
			} else {
				var img = new Image();
				img.onload = function() {
					self.loading.hide();
					data.loaded = true;
					self.fade_img(self.img, img.src);
				};
				img.src = data.src;
			} 
		}
	};

	window.Timeline = Timeline;
}());
