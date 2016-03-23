window.onresize = function(){
	$('.container').addClass(function(){
		return window.innerWidth <1281 ? 'fluid' : '';
	});
}