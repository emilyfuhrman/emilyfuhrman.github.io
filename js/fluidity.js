var cutoff_tier1 = 1281,
	cutoff_tier2 = 1025,
	cutoff_tier3 = 961,
	cutoff_tier4 = 641,
	cutoff_tier5 = 481,
	cutoff_tier6 = 320,

	cutoff_scroll = 26;

var setFluid = function(){
	setFixedHeader();
	$('.container').addClass(function(){
		return window.innerWidth <cutoff_tier1 ? 'fluid' : '';
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