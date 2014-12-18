<?php
  $json_string 	= file_get_contents("http://api.wunderground.com/api/cf27f3bd448ee3b9/geolookup/conditions/q/NY/New_York.json");
  $parsed_json 	= json_decode($json_string);
  $location    	= $parsed_json->{'location'}->{'city'};
  $locap		= strtoupper($location);
  $temp_f 		= $parsed_json->{'current_observation'}->{'temp_f'};
  $hum 			= $parsed_json->{'current_observation'}->{'relative_humidity'};
  $hum_dec 		= str_replace('%', '', $hum);  
  $index_f		= $parsed_json->{'current_observation'}->{'feelslike_f'};
  $wind_dir  	= $parsed_json->{'current_observation'}->{'wind_dir'};
  $dircap	 	= strtoupper($wind_dir);
  $wind_gust 	= $parsed_json->{'current_observation'}->{'wind_gust_mph'};
?>

var jloc	= "<?php echo $locap ?>";
var jtemp	= "<?php echo $temp_f; ?>";
var jhum	= "<?php echo $hum_dec; ?>";
var jindex	= "<?php echo $index_f; ?>"; 
var jwind	= "<?php echo $dircap; ?>";
var jgust	= "<?php echo $wind_gust; ?>"; 
console.log(jgust);