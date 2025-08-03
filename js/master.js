//for translations
var default_lang = "en";
$("div.description:not([lang=" +default_lang +"])").hide();
$(".lang-switcher").click(function(e){
	default_lang = e.target.id;
	$(".lang-switcher").removeClass('active');
	$(this).addClass('active');
	$("div.description:not([lang=' +default_lang +'])").hide();
	$("div.description[lang=" +default_lang +"]").show();
});

//hide next/prev. arrows when navigating from list
const URL_params = new URLSearchParams(window.location.search);
if(URL_params.get('source') === 'list'){
	$("#post-nav").hide();
}

//progressive image loading
document.addEventListener('DOMContentLoaded', function() {
    const blurImgs = document.querySelectorAll('.blur-load');
    blurImgs.forEach(img => {
        // Set blurred image as background, clear the src
        img.style.backgroundImage = `url(${img.src})`;
        img.style.backgroundSize = 'cover';
        img.style.backgroundPosition = img.style.objectPosition || 'center';
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // transparent pixel
        
        // Load high-res image
        const fullImg = new Image();
        fullImg.onload = () => {
            img.src = fullImg.src;
            img.classList.remove('blur-load');
        };
        fullImg.src = img.dataset.large;
    });
});