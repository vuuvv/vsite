$(function() {
	$(".main_menu_item").hover(function() {
		$(this).addClass("hovered");
		$(">.dropmenu", this).slideDown("fast");
	}, function() {
		$(this).removeClass("hovered");
		$(">.dropmenu", this).slideUp("fast");
	});
});
