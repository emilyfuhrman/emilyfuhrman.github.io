$(document).ready(function(){
	setFluid();
	if(window.location.pathname.length === 0 || window.location.pathname === '/'){
		schema().generate();
	}
});
window.onunload = function(){};
window.onresize = function(){
	setFluid();
	if(window.location.pathname.length === 0 || window.location.pathname === '/'){
		schema().generate();
	}
};
window.onscroll = setFixedHeader;