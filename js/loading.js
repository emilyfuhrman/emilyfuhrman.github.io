//fade in once all images are done
var $content = $('.container#main');

$content.imagesLoaded({ background: '.panel_item_image' }).always(function(){
	$('#loading_animation').addClass('hide');
	$content.addClass('show');
});