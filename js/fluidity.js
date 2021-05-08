var cutoff_tier1 = 1281,
	cutoff_tier2 = 1025,
	cutoff_tier3 = 961,
	cutoff_tier4 = 641,
	cutoff_tier5 = 481,
	cutoff_tier6 = 320,

	cutoff_scroll = 26;

var setFluid = function(){
	// setFixedHeader();
	if(window.innerWidth <cutoff_tier1){
		$('.container').addClass('fluid');
	} else{
		$('.container').removeClass('fluid');
	}
}
// var setFixedHeader = function(){
// 	var scrollTop = $(window).scrollTop();
// 	if(scrollTop >= cutoff_scroll){
// 		$('#nav').addClass('fixed');
// 	} else{
// 		$('#nav').removeClass('fixed');
// 	}
// }