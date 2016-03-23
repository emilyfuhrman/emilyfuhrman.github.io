var cutoff_width = 1281,
	cutoff_scroll = 24;

var setFluid = function(){
	setFixedHeader();
	$('.container').addClass(function(){
		return window.innerWidth <cutoff_width ? 'fluid' : '';
	});
}
var setFixedHeader = function(){
	var scrollTop = $(window).scrollTop();
	if(scrollTop >= cutoff_scroll){
		$('#nav').addClass('fixed');
	} else{
		$('#nav').removeClass('fixed');
	}
}

window.onload = setFluid;
window.onresize = setFluid;
window.onscroll = setFixedHeader;