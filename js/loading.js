//fade in once eager images are done
var $content = $('.container#main');

// Only wait for images that should load immediately (eager loading)
var $eagerImages = $content.find('img[loading="eager"]');

if ($eagerImages.length > 0) {
	$eagerImages.imagesLoaded({
		background: false
	}).always(function(){
		$('#loading-animation').addClass('hide');
		$content.addClass('show');
	});
} else {
	// If no eager images, show content immediately
	$('#loading-animation').addClass('hide');
	$content.addClass('show');
}