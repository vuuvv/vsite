$(function() {
	function log(msg) {
		$(".content").append($("<div>" + msg + "</div>"));
	};

	$(".main_menu_item, .main_menu_item_leaf").hover(function() {
		$(this).addClass("hovered");
		$(">.dropmenu:not(:animated)", this).slideDown("fast");
		// ie6,7 bug: will turn the parent overflow to hidden
		$(this).parents(".dropmenu").css("overflow", "visible");
	}, function() {
		$(this).removeClass("hovered");
		$(">.dropmenu", this).hide();//slideUp("slow");
	});

	$(".left-nav .box-title").hover(function() {
		$(this).addClass("box-title-hovered");
	}, function() {
		$(this).removeClass("box-title-hovered");
	});

	$(".left-nav .box-item a").hover(function() {
		$(this).find(".box-item-arrow").show();
	}, function() {
		$(this).find(".box-item-arrow").hide();
	});

	$(".box-toggle").click(function() {
		var box = $(this).parents(".box"),
			container = box.find(".box-container");
		if (box.hasClass("box-closed")) {
			//container.hide();
			//container.css("display", "none");
			//box.removeClass("box-opened");
			container.slideDown(function() {
				box.removeClass("box-closed");
			});
		} else {
			container.slideUp(function() {
				box.addClass("box-closed");
			});
			//container.show();
			//container.css("display", "block");
			//box.addClass("box-opened");
		}
	});
});
