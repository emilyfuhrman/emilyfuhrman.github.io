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

//show content after eager images load
document.addEventListener('DOMContentLoaded', function() {
    // Handle loading animation for eager images
    const eagerImages = document.querySelectorAll('img[loading="eager"]');
    let loadedCount = 0;
    
    function showContent() {
        document.getElementById('loading-animation').classList.add('hide');
        document.querySelector('.container#main').classList.add('show');
    }
    
    if (eagerImages.length > 0) {
        eagerImages.forEach(img => {
            if (img.complete) {
                loadedCount++;
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === eagerImages.length) {
                        showContent();
                    }
                });
            }
        });
        if (loadedCount === eagerImages.length) {
            showContent();
        }
    } else {
        showContent();
    }
    
    //progressive image loading
    const blurImgs = document.querySelectorAll('.blur-load');
    
    // Create intersection observer for lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadHighResImage(entry.target);
                imageObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '50px' });
    
    function loadHighResImage(img) {
        // Set blurred image as background
        img.style.backgroundImage = `url(${img.src})`;
        img.style.backgroundSize = 'cover';
        img.style.backgroundPosition = img.style.objectPosition;
        
        // Load high-res image
        const fullImg = new Image();
        fullImg.onload = () => {
            img.style.opacity = '0';
            img.src = fullImg.src;
            img.classList.remove('blur-load');
            img.style.opacity = '1';
            
            // Clean up background after transition
            setTimeout(() => {
                img.style.backgroundImage = '';
            }, 300);
        };
        fullImg.src = img.dataset.large;
    }
    
    blurImgs.forEach((img, index) => {
        // Load first 3 images immediately (above the fold)
        if (index < 3) {
            loadHighResImage(img);
        } else {
            // Lazy load the rest
            imageObserver.observe(img);
        }
    });
});