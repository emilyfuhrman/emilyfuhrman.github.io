//initialize masonry
var $grid = $('.grid').masonry({
	itemSelector: '.grid-item'
});

//only layout Masonry after images are loaded
$grid.imagesLoaded().progress(function(){
	$grid.masonry('layout');
});