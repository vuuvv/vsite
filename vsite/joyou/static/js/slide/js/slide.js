(function() {
	var Board = function(data) {
		this.thumb = data.thumb;
		this.img = data.img;
		this.info = data.info;
		this.loaded = false;
		this.initialize();
	};

	Board.prototype = {
		initialize: function() {
		},

		on_load: function() {
		}
	};

	var Slide = function(options) {
		this.initialize(options);
	};

	Slide.prototype = {
		defaults: {
			container: "#slide",
			width: 100,
			padding: 10,
			item_padding: 9,
			scale: 0.75,
			count: 5,
			left: 10,
			duration: 400,
			width: 240,
			height: 180,
			styles: [
				{width: 80, top: 63, left: 0, display: "none", "z-index": 100},
				{width: 180, top: 38, left: 10, "font-size": "12px", "z-index": 101},
				{width: 200, top: 25, left: 155, "font-size": "14px", "z-index": 102},
				{width: 240, top: 0, left: 345, "font-size": "16px", "z-index": 103},
				{width: 200, top: 25, left: 575, "font-size": "14px", "z-index": 102},
				{width: 180, top: 38, left: 740, "font-size": "12px", "z-index": 101},
				{width: 100, top: 63, left: 800, display: "none", "z-index": 100}
			]
		},

		initialize: function(options) {
			var opts = this.options = $.extend({}, this.defaults, options);
			this.container = $(opts.container);
			opts.styles = this.calc_styles();
			this.items = this.get_data();
			this.generate_boards();
			this.set_css();
			this.bind_events();
			this.container.css("background-image", "none");
		},

		get_data: function() {
			var items = [];
			this.container.find(".slide-data li").each(function(i, elem) {
				var item = {};
				var $elem = $(elem);
				item.thumb = $elem.attr("data-thumb");
				item.img = $elem.attr("data-img");
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
			styles[0].display = "none";
			styles[count - 1].display = "none";
			return styles;
		},

		set_board: function(index) {
		},

		generate_boards: function() {
			var items = this.items;
			for(var i = 0, len = this.options.count + 2; i < len; i++) {
				var board = this.generate_board(items[i]);
				this.container.append(board);
			}
		},

		generate_board: function(data) {
			var board = $('<div class="board"><div class="board-img"><a href="' + data.img + '"></a></div></div>');
			var image = new Image();
			image.onload = function() {
				var img = $("<img>");
				img.attr("src", data.thumb);
				board.css("background-image", "none")
				board.find(".board-img a").append(img);
			}
			image.src = data.thumb;
			return board;
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
			this.move(center - index);
			return false;
		},

		reset_board: function(board, i) {
			board.off("click").css(this.options.styles[i]).click(this.on_board_click);
		},

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

			step -= direction;

			if (direction > 0) {
				last.remove();
				last.insertBefore(first);
				this.reset_board(last, 0);
				first.show();
			} else {
				first.remove();
				first.insertAfter(last);
				this.reset_board(last, length - 1);
				last.show();
			}

			boards.stop().each(function(i, elem) {
				if ((direction > 0 && i == length - 1) || (direction < 0 && i == 0))
					return;
				var $this = $(this);
				var w, t, l, style;
				style = styles[i + direction];
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
