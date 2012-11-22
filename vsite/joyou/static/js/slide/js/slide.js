(function() {
	var Slide = function(options) {
		this.initialize(options);
	};

	Slide.prototype = {
		defaults: {
			count: 5,
			left: 10,
			duration: 400,
			width: 240,
			height: 180,
			positions: [
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
			this.container = $("#slide");
			this.set_css();
			this.bind_events();
		},

		generate_board: function(thumb, info, img) {
			var board = $('<div class="board"><div class="board-img"><a href="' + img + '"></a></div></div>');
		},

		set_css: function() {
			var positions = this.options.positions;
			this.get_boards().each(function(i, elem) {
				$(elem).css(positions[i]);
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
			board.off("click").css(this.options.positions[i]).click(this.on_board_click);
		},

		move: function(step) {
			if (step == 0)
				return;
			var self = this;
			var boards = this.boards;
			var opts = this.options;
			var positions = opts.positions;
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
				var w, t, l, pos;
				pos = positions[i + direction];
				w = pos["width"];
				t = pos["top"];
				l = pos["left"];
				$this.css("z-index", pos["z-index"]);
				$this.animate({
					width: w,
					top: t,
					left: l
				}, {
					duration: opts.duration,
					complete: function() {
						$this.css(pos);
						self.move(step);
					}
				});
			});
		}
	};

	window.Slide = Slide;
}());
