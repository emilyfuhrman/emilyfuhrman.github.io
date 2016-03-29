$('.video-container').on('click',function(){
	var vid = this.children[1];
	if(vid.paused){
		vid.play();
		$(this).addClass('active');
	} else{
		vid.pause();
		$(this).removeClass('active');
	}
});