jQuery(document).ready(function($) { 
	$.ajaxSetup ({
		cache: false
	});
	$.ajax({
	url : "http://api.wunderground.com/api/cf27f3bd448ee3b9/geolookup/conditions/q/NY/New_York.json",
	dataType : "jsonp",
	success : function(parsed_json) {
		var jloc	= parsed_json['location']['city'];
		var jtemp	= parsed_json['current_observation']['temp_f'];
		var hum		= parsed_json['current_observation']['relative_humidity'];
		var jhum	= hum.replace("%","");
		var jindex	= parsed_json['current_observation']['feelslike_f']; 
		var wind	= parsed_json['current_observation']['wind_dir'];
		var jwind	= wind.toUpperCase();
		var jgust	= parsed_json['current_observation']['wind_gust_mph'];
	}
	});
}, 50);