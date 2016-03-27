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
	/*if($('#proj-list').length){
		formatProjectPage();
	}*/
}
var setFixedHeader = function(){
	var scrollTop = $(window).scrollTop();
	if(scrollTop >= cutoff_scroll){
		$('#nav').addClass('fixed');
	} else{
		$('#nav').removeClass('fixed');
	}
}
var formatProjectPage = function(){
	/*var imgH = $('._01.list-img-link .list-img').height();
	$('.metadata').height(function(){
		var factor = 0.8166,
			
			origH = 216,
			metaH = window.innerWidth <cutoff_tier1 ? imgH*factor : origH;
		return metaH +'px';
	});*/
}

window.onload = setFluid;
window.onresize = setFluid;
window.onscroll = setFixedHeader;