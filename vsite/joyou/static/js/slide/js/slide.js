(function() {
	
	var mod = function(a, b) {
		var m = a % b;
		return m < 0 ? b + m : m;
	}

	var Slide = function(options) {
		this.initialize(options);
	};

	Slide.prototype = {
		defaults: {
			container: "#slide",
			padding: 10,
			item_padding: 9,
			scale: 0.75,
			count: 5,
			left: 10,
			duration: 400,
			container_width: 980,
			width: 240,
			height: 180
		},

		initialize: function(options) {
			var opts = this.options = $.extend({}, this.defaults, options);
			this.container = $(opts.container);
			opts.styles = this.calc_styles();
			this.index = 0;
			this.items = this.get_data();
			this.generate_boards();
			this.set_css();
			this.bind_events();
			this.container.removeClass("loading");
		},

		get_data: function() {
			var items = [];
			this.container.find(".slide-data li").each(function(i, elem) {
				var item = {};
				var $elem = $(elem);
				item.thumb = $elem.attr("data-thumb");
				item.img = $elem.attr("data-img") || "#";
				item.info = $elem.text();
				item.loaded = false;
				items.push(item);
			});
			return items;
		},

		calc_styles: function() {
			var opts = this.options;
			var padding = 2 * opts.item_padding;
			var w = opts.width + padding;
			var h = opts.height + padding;
			var count = opts.count + 2;
			var scale = opts.scale;
			var styles = [];
			var center = Math.floor(count / 2);
			var left = 0;
			var zindex = 100 + center;

			for (var i = 0; i < count; i++) {
				var style = {};
				var offset = Math.abs(i - center);
				var pscale = Math.pow(scale, offset);
				var width = Math.floor(pscale * w);
				var height = Math.floor(pscale * h);

				style.width = width - padding;
				style.height = height - padding;

				style.top = Math.floor((h - height) / 2);
				style.left = left;
				if (i > center) {
					left += Math.floor(width - width * scale * (1 - scale));
				} else {
					left += Math.floor(width * scale);
				}
				style["z-index"] = zindex - offset;
				styles.push(style);
			}
			// get the total visible length
			this.total_length = style.left + width * (1 - 2 * scale);
			var delta = width * scale + (this.total_length - opts.container_width) / 2;
			$.each(styles, function(i, item) {
				item.left -= delta;
			});
			// set first and last board invisible
			style.display = "none";
			styles[0].display = "none";
			return styles;
		},

		generate_boards: function() {
			var boards = this.boards = $('<div class="boards"></div>').css({
					width: this.total_length,
					height: this.options.height + 2 * this.options.padding
			});
			var items = this.items;
			var items_length = items.length;
			for(var i = 0, len = this.options.count + 2; i < len; i++) {
				var board = this.generate_board(items[i % items_length]);
				boards.append(board);
			}
			this.container.append(boards);
		},

		generate_board: function(data) {
			var board = $('<div class="board loading"><div class="board-img"><div class="link" href="' + data.img + '"><img/></div></div></div>');
			if (data.loaded) {
				board.find("img").attr("src", data.thumb);
			} else {
				this.load_img(board, data);
			}
			return board;
		},

		load_img: function(board, data) {
			var img = board.find("img");
			var link = board.find(".board-img .link");
			img.remove();
			if (!board.hasClass("loading"))
				board.addClass("loading");
			var image = new Image();
			image.onload = function() {
				img.attr("src", data.thumb);
				board.removeClass("loading");
				link.append(img);
				data.loaded = true;
			}
			image.src = data.thumb;
		},

		set_board_data: function(board, data) {
			var link = board.find(".board-img .link");
			link.attr("href", data.img);

			if (data.loaded) {
				var img = board.find("img");
				img.attr("src", data.thumb).appendTo(link);
			} else {
				this.load_img(board, data);
			}
		},

		set_css: function() {
			var styles = this.options.styles;
			this.get_boards().each(function(i, elem) {
				$(elem).css(styles[i]);
			});
		},

		bind_events: function() {
			var self = this;
			this.on_board_click = function() {
				return self._on_board_click($(this));
			};
			this.get_boards().click(this.on_board_click);
		},

		get_boards: function() {
			return this.container.find(".board");
		},

		_on_board_click: function(board) {
			var boards = this.get_boards();
			var index = boards.index(board);
			var center = Math.floor(boards.length / 2);
			if (index == center)
				return;
			this.move(index - center);
			return false;
		},

		reset_board: function(board, i) {
			board.off("click").css(this.options.styles[i]).click(this.on_board_click);
		},

		// actual move one step a function
		move: function(step) {
			if (step == 0)
				return;
			var self = this;
			var boards = this.boards;
			var opts = this.options;
			var styles = opts.styles;
			var boards = this.get_boards();
			var length = boards.length;
			var first = boards.eq(0);
			var last = boards.eq(length - 1);
			var direction = step > 0 ? 1 : -1;
			var count = opts.count + 2;
			var items = this.items;

			step -= direction;

			var index = this.index;

			if (direction < 0) {
				last.remove();
				if (count < items.length) {
					var i = mod((index - 1), items.length);
					this.set_board_data(last, items[i]);
				}
				last.insertBefore(first);
				this.reset_board(last, 0);
				first.show();
			} else {
				first.remove();
				if (count < items.length) {
					var i = mod((index + boards.length), items.length);
					this.set_board_data(first, items[i]);
				}
				first.insertAfter(last);
				this.reset_board(last, length - 1);
				last.show();
			}
			index = this.index = mod((index + direction), boards.length);

			boards.stop().each(function(i, elem) {
				if ((direction < 0 && i == length - 1) || (direction > 0 && i == 0))
					return;
				var $this = $(this);
				var w, t, l, style;
				style = styles[i - direction];
				w = style["width"];
				h = style["height"];
				t = style["top"];
				l = style["left"];
				$this.css("z-index", style["z-index"]);
				$this.animate({
					width: w,
					top: t,
					left: l,
					height: h
				}, {
					duration: opts.duration,
					complete: function() {
						$this.css(style);
						self.move(step);
					}
				});
			});
		}
	};

	window.Slide = Slide;
}());
