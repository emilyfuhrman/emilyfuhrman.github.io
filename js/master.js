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


//for translations
var default_lang = "en";
$("div.descrip:not([lang=" +default_lang +"])").hide();
$(".langSwitcher").click(function(e){
	default_lang = e.target.id;
	$(".langSwitcher").removeClass('active');
	$(this).addClass('active');
	$("div.descrip:not([lang=' +default_lang +'])").hide();
	$("div.descrip[lang=" +default_lang +"]").show();
});

// $('[lang="fr"]').hide();

// $('.langSwitcher').click(function(){

// });

// $('[lang="es"]').hide();

// $('#switch-lang').click(function() {
//   $('[lang="es"]').toggle();
//   $('[lang="en"]').toggle();
// });