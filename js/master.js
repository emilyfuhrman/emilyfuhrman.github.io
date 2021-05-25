//for translations
var default_lang = "en";
$("div.descrip:not([lang=" +default_lang +"])").hide();
$(".lang-switcher").click(function(e){
	default_lang = e.target.id;
	$(".lang-switcher").removeClass('active');
	$(this).addClass('active');
	$("div.descrip:not([lang=' +default_lang +'])").hide();
	$("div.descrip[lang=" +default_lang +"]").show();
});

//hide next/prev. arrows when navigating from list
const URL_params = new URLSearchParams(window.location.search);
if(URL_params.get('source') === 'list'){
	$("#post-nav").hide();
}