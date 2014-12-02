	// HTML5 HISTORY API NAV -----------------------------------------------------------------------
	
	function supports_history_api() {
	return !!(window.history && history.pushState);
	}
	
	function setupHistoryClicks() {
	addClicker( document.getElementById('btn-vis') )
	}
	
	function addClicker(link) {
  	link.addEventListener("click", function(e) {
  	swapProj(link.href);
  	history.pushState(null, null, link.href);
  	e.preventDefault();
  	}, false);
	}
	
	function swapProj(href) {
	var req = new XMLHttpRequest();
	req.open("GET",
		 	"http://localhost:8888/bootcamp/" + 
			 href.split("/").pop(),
			 false);
	req.send(null);
  	if (req.status == 200) {
  	document.getElementById('space').innerHTML = req.responseText;
  	setupHistoryClicks();
  	return true;
  	}
	return false;
	}
	
	window.onload = function() {
	if (!supports_history_api()) { return; }
	setupHistoryClicks();
	window.setTimeout(function() {
		window.addEventListener("popstate", function(e) {
		swapProj(location.pathname);
		}, false);
	}, 1);
	}
	
	// AJAX NAV ------------------------------------------------------------------------------------
	
	function singleProj() {
	force.stop();
	if (this.id === "0") {
		$("#chart").hide();
		$.ajax({url:"projects/201109-strangers-on-the-metro.html", success:function(result){
			$("#proj").html(result);
		}});
		//window.history.pushState("visualization", "STRANGERS ON THE METRO", "/bootcamp/projects/201109-strangers-on-the-metro.html");		
	}
	
	else if (this.id === "1") {
		onlyVis();
		$("#chart").hide();
		$.ajax({url:"projects/201201-flowchart-for-the-month-of-january.html", success:function(result){
			$("#proj").html(result);
		}});
		//window.history.pushState("visualization", "FLOWCHART FOR THE MONTH OF JANUARY", "/bootcamp/projects/201201-flowchart-for-the-month-of-january.html");
	}
	else if (this.id === "2") {
		onlyVis();
		$("#chart").hide();
		$.ajax({url:"projects/201208-miles-from-my-bed.html", success:function(result){
			$("#proj").html(result);
		}});
		//window.history.pushState("visualization", "MILES FROM MY BED", "/bootcamp/projects/201208-miles-from-my-bed.html");
	}
	else if (this.id === "3") {
		onlyVis();
		$("#chart").hide();
		$.ajax({url:"projects/201207-glass-embassy.html", success:function(result){
			$("#proj").html(result);
		}});
		//window.history.pushState("visualization", "GLASS EMBASSY", "/bootcamp/projects/201207-glass-embassy.html");
	}
	}
	
	
	// FILTER INTO LIST ----------------------------------------------------------------------------
	
	d3.select("#btn-vis")
	 	.on("click", onlyVis);
	
	// morph galaxy into ordered list
	
	function onlyVis() {
	force.stop();
	$("#chart").fadeIn(300);
	$(".proj").fadeOut(250);
	node
		.transition().duration(500).delay(400).attr("cx", 360)
	 	.transition().duration(500).delay(400).attr("cy", function(d) { return d.ypos; })
	 	.transition().duration(500).attr("r", 12)
	node
	 	.filter(function(d) { return d.category == "visualization"; })
	link
		.transition().duration(250).attr("opacity", 0)
		.remove();
	} 
	
