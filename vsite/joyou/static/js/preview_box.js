(function() {
	var existed = false;
	var body = $("body");

	var PreviewBox = function() {
		this.box = $('.preview-box');
		var self = this;
		$(".preview-close").click(function() {
			self.hide();
		});
		$(document).on("keyup", function(e) {
			if (e.keyCode == 27) {
				self.hide();
			}
		});
	};

	PreviewBox.prototype = {
		show: function() {
			this.box.height(body.height());
			this.box.fadeIn();
		},

		show_img: function(src) {
			var self = this;
			var $loading = $(".previewer-loading");
			var $photo = $(".previewer-photo");
			$photo.html("");
			this.show();
			$loading.show();
			var preload = new Image();
			preload.onload = function() {
				$loading.hide();
				$img = $("<img>");
				$img.attr("src", src);
				var w = preload.width, h = preload.height;
				$img.css({
					left: (self.box.width() - w) / 2,
					top: 20
				});
				$photo.append($img);
			};
			preload.src = src;
		},

		hide: function() {
			this.box.hide();
		}
	};

	window.PreviewBox = PreviewBox;
}());
