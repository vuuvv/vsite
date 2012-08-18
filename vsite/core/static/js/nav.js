$(function() {
	$(".main_menu_item, .main_menu_item_leaf").hover(function() {
		$(this).addClass("hovered");
		$(">.dropmenu:not(:animated)", this).slideDown("fast");
		//$(">.dropmenu:not(:animated)", this).show();
	}, function() {
		$(this).removeClass("hovered");
		$(">.dropmenu", this).hide();//slideUp("slow");
	});

	$(".main_menu_item_link").click(function(e){
		var w = $(this).parents(".dropmenu").height();
		alert(w);
		return;
	});
});
