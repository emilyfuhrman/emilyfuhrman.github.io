var cutoff_tier = 961,
		cutoff_scroll = 60;

var setFixedHeader = function(){
	var scrollTop = $(window).scrollTop();
	if(window.innerWidth >cutoff_tier){
		$('#nav_log').addClass('stickable');
	} else{
		$('#nav_log').removeClass('stickable');
	}
	if(scrollTop >= cutoff_scroll){
		$('#nav_log, .page_label, .panel_label').addClass('fixed');
	} else{
		$('#nav_log, .page_label, .panel_label').removeClass('fixed');
	}
}

window.onscroll = setFixedHeader;