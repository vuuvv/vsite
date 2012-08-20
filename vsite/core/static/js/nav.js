$(function() {
	function log(msg) {
		$(".content").append($("<div>" + msg + "</div>"));
	};

	$(".main_menu_item, .main_menu_item_leaf").hover(function() {
		var $this = this;
		$this.addClass("hovered");
		$(">.dropmenu:not(:animated)", this).slideDown("fast");
		// ie6,7 bug: will turn the parent overflow to hidden
		$this.parents(".dropmenu").css("overflow", "visible");
	}, function() {
		var $this = this;
		$this.addClass("hovered");
		$(">.dropmenu", this).hide();//slideUp("slow");
	});
});
