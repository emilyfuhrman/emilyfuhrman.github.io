<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>weather machine</title>
<script src="js/modernizr.custom.js" type="text/javascript"></script>
<script src="http://code.jquery.com/jquery-latest.js"></script>
<link href='style.css' rel='stylesheet' type='text/css' />
<link rel='icon' href='favicon.ico' />
		
	<!-- modernizr -->
	<script type="text/javascript">
	function doesBrowserSuck(){
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
	}
	/*if(!canvasSupported)
	{
	print("shitty browser");
	}*/
	</script>
	
	<!-- page fade transition -->
	<script type="text/javascript" >
		$(document).ready(function() {
			$("body").css("display", "none");
			$("body").fadeIn(0750);	
			$("a.transition").click(function(event) {
				event.preventDefault();
				linkLoc = this.href;
				$("body").fadeOut(0300, redirectPage);
			});
			function redirectPage(){
				window.location = linkLoc;
			};
		});
	</script>
		
	<!-- google analytics -->
	<script type="text/javascript">

	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-34550328-1']);
	_gaq.push(['_trackPageview']);

	(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
	</script>
	
</head>
<body>
<script src="dynamic.php" type="text/javascript"></script>
<script src="tempLine.js" type="text/javascript"></script>
<script src="bomb.js" type="text/javascript"></script>
<script src="vane.js" type="text/javascript"></script>
<canvas id="canvas">[:( no canvas support here]</canvas>
<div id="w-logo"><a href="http://www.wunderground.com/?apiref=798722a8ac902e34" target="_blank"><img src="imgs/wunderground-logo.png" alt="wunderground logo" width="62px"></a></div>
<div id="emily-fuhrman"><a href="http://y-li.me" target="_blank"><img src="imgs/btn-by.png" alt="emily fuhrman"></a></div>
<script src="render.js" type="text/javascript"></script>
</body>
</html> 