$(function() {
	$(".main_menu_item, .main_menu_item_leaf").hover(function() {
		$(this).addClass("hovered");
		$(">.dropmenu:not(:animated)", this).slideDown("fast");
	}, function() {
		$(this).removeClass("hovered");
		$(">.dropmenu", this).slideUp("fast");
	});
});
