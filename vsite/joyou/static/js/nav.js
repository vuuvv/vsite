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

	$(".main_menu_item_link").click(function(e){
		var p = $(this).parents("ul");
		var d = $(this).parents(".dropmenu");
		alert(d.css("overflow"));
		return false;
	});
});
