//initialize masonry
var $grid = $('.grid').masonry({
	itemSelector: '.grid-item',
	transitionDuration: 0
});

//only layout Masonry after images are loaded
$grid.imagesLoaded().progress(function(){
	$grid.masonry('layout');
});

//fade in once all images are done
$grid.imagesLoaded().always(function(){
	$('.log.container#main').addClass('show');
});