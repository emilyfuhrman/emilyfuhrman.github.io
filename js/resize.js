var setFluid = function(){
	$('.container').addClass(function(){
		return window.innerWidth <1281 ? 'fluid' : '';
	});
}

window.onload = setFluid;
window.onresize = setFluid;