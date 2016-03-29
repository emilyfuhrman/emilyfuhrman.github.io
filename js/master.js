window.onload = function(){
	setFluid();
	if(window.location.pathname === '/'){
		schema().generate();
	}
};
window.onresize = function(){
	setFluid();
	if(window.location.pathname === '/'){
		schema().generate();
	}
};
window.onscroll = setFixedHeader;