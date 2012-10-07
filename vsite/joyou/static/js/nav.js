$(function() {
	function log(msg) {
		$(".content").append($("<div>" + msg + "</div>"));
	};

	var header_search = $("#header_search_box");
	var header_search_input = $("#header_search_box input");
	var placeholder = "搜索产品、新闻";

	header_search_input.val(placeholder);
	header_search_input.data("dirty", false);

	header_search.hover(function() {
		$(this).addClass("header_search_box_active");
	}, function() {
		var $this = $(this);
		if (!$this.find("input").data("is_focus")) {
			$(this).removeClass("header_search_box_active");
		}
	});

	header_search_input.focus(function() {
		var $this = $(this);
		$this.data("is_focus", true);
		if (!$this.data("dirty")) {
			$this.val("");
		}
		if ($this.val() !== "") {
			if ($.browser.msie)
				this.createTextRange().select();
			else {
				this.selectionStart = 0;
				this.selectionEnd = this.value.length;
			}
		}
		header_search.addClass("header_search_box_active");
	});

	header_search_input.blur(function() {
		var $this = $(this);
		$this.data("is_focus", false);
		if ($this.val() === "") {
			$this.val(placeholder);
			$this.data("dirty", false);
		}
		header_search.removeClass("header_search_box_active");
	});

	header_search_input.change(function() {
		$(this).data("dirty", true);
	});

	var search_submit = function() {
		var val = header_search_input.val();
		if (!header_search_input.data("dirty")) {
			alert("请输入搜索内容");
			return;
		}
		var form = $("#search_form");
		window.location.href=form.attr("action") + "/" + header_search_input.val();
	};

	$("#search_button").click(function() {
		search_submit();
		return false;
	});

	$("#search_form").submit(function() {
		header_search_input.blur();
		search_submit();
		return false;
	});

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
			container.slideDown(function() {
				box.removeClass("box-closed");
			});
		} else {
			container.slideUp(function() {
				box.addClass("box-closed");
			});
		}
		return false;
	});

	$(".thumb-btn").click(function() {
		var $this = $(this);

		if (!$this.hasClass("thumb-active")) {
			$(".thumb-active").removeClass("thumb-active");
			$this.addClass("thumb-active");
			$("#serial_pic").attr("src", $this.attr("href"));
		}

		return false;
	});

	$(".tab-anchor").click(function() {
		var tab = $(this).parents("li")
		if (!tab.hasClass("selected")) {
			$(".tab-bar li.selected").removeClass("selected");
			tab.addClass("selected");
		}
		return false;
	});
});
