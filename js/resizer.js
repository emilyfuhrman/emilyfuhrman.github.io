window.onresize = function(){
	$('.container').addClass(function(){
		return window.innerWidth <1280 ? 'fluid' : '';
	});
}