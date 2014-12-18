var canvas = document.getElementById('canvas'),
	c = canvas.getContext('2d');
	c.canvas.width 	= window.innerWidth;
	c.canvas.height = window.innerHeight;
	c.fillStyle = "rgb(250, 255, 255)";
	c.fillRect(0, 0, window.innerWidth, window.innerHeight);
	
	enhanceContext(canvas,c);
	calc();
	
	var yax,
		temp,
		hum,
		index,
		xTemp,
		xHum,
		Bomb,
		bombAng,
		bombRad,
		Vane,
		vanAng,
		spin,
		currenTemp,
		yy,
		ratio;

	function enhanceContext(canvas,context){
		ratio = window.devicePixelRatio || 1,
		width = c.canvas.width,
		height = c.canvas.height;

		if (ratio > 1) {
			c.canvas.width = width * ratio;
			c.canvas.height = height * ratio;
			c.canvas.style.width = width + "px";
			c.canvas.style.height = height + "px";
			context.scale(ratio, ratio);
		}

	}
	
	function calc()
	{
		yax  	= Math.floor(window.innerHeight/100);
		temp 	= Math.floor(jtemp*yax);
		index 	= Math.floor(jindex*yax);
		hum		= Math.floor(jhum*yax);
		bombRad = Math.floor(window.innerWidth/5.5);
		bombAng	= 0;
		spin	= 35 - jgust;
		currentTemp = "000.0";
		currentHum	= "000.0";
		yy = 0;
		
		if(jgust=='')
		{
			jgust = "0.0";
		}
		
		if(jwind=='SOUTH')
		{
			vanAng = Math.PI*2;
		}
		else if(jwind=='SSE')
		{
			vanAng = Math.PI/8;
		}
		else if(jwind=='SE')
		{
			vanAng = Math.PI/4;
		}
		else if(jwind=='ESE')
		{
			vanAng = 3*(Math.PI/8);
		}
		else if(jwind=='EAST')
		{
			vanAng = Math.PI/2;
		}
		else if(jwind=='ENE')
		{
			vanAng = 5*(Math.PI/8);
		}
		else if(jwind=='NE')
		{
			vanAng = 3*(Math.PI/4);
		}
		else if(jwind=='NNE')
		{
			vanAng = 7*(Math.PI/8);
		}
		else if(jwind=='NORTH')
		{
			vanAng = Math.PI;
		}
		else if(jwind=='NNW')
		{
			vanAng = 9*(Math.PI/8);
		}
		else if(jwind=='NW')
		{
			vanAng = 5*(Math.PI/4);
		}
		else if(jwind=='WNW')
		{
			vanAng = 11*(Math.PI/8);
		}
		else if(jwind=='WEST')
		{
			vanAng = 3*(Math.PI/2);
		}
		else if(jwind=='WSW')
		{
			vanAng = 13*(Math.PI/8);
		}
		else if(jwind=='SW')
		{
			vanAng = 7*(Math.PI/4);
		}
		else if(jwind=='SSW')
		{
			vanAng = 15*(Math.PI/8);
		}
		
		windBlitz();
	}
	
	// mouseover
	canvas.addEventListener('mousemove', function(e) {
		yy = e.pageY;
		var y = (window.innerHeight - e.pageY)/yax;
		var r = y.toFixed(1);
		if(r.length == 3)
		{
			r = '00'+r;
		}
		if(r.length == 4)
		{
			r = '0'+r;
		}
		currentTemp = r;
		var h = (window.innerHeight - e.pageY)/(yax + 0.4);
		//console.log(h);
		var z = h.toFixed(1); 
		if(z.length == 3)
		{
			z = '00'+z;
		}
		if(z.length == 4)
		{
			z = '0'+z;
		}
		currentHum = z;
	}, 0);
	
	// draw wind blitz
	function windBlitz()
	{
		c.save();
		c.translate(window.innerWidth/2, (window.innerHeight - index) - 0.5);
		Bomb = new bomb(0, bombRad, 3.5, 80);
		setInterval(function()
		{
			c.save();
			c.fillStyle = "rgb(250, 255, 255)";
			c.fillRect(0, 0, window.innerWidth, window.innerHeight);	
			c.translate(window.innerWidth/2, (window.innerHeight - index) - 0.5);
			c.rotate( Math.PI/3 );
			Bomb.drawBomb(c);
			c.restore();
			
			// draw vane
			Vane = new vane(window.innerWidth/2, (window.innerHeight - index) - 0.5, vanAng, jwind);
			Vane.drawVane(c);

			paramz();
			tempLines();
			
			// draw text top
			c.fillStyle = "rgb(205, 215, 210)";
			c.fillRect(35, 3, 180, 98);
			c.strokeStyle = "rgb(165, 175, 170)";
			c.lineWidth = 5;
			c.stroke();
			c.fillStyle = "rgb(255, 255, 255)";
			c.font = "9px Arial";
			c.textAlign = "left";
			c.textBaseline = "alphabetic";
			c.fillText(jloc, 53, 21);
			c.fillText("TEMPERATURE: ", 53, 43);
			c.fillText("HUMIDITY: ", 53, 54);
			c.fillText("HEAT INDEX: ", 53, 65);
			c.fillText("WIND SPEED: ", 53, 76);
			c.fillText("WIND DIRECTION: ", 53, 87);
			c.fillText(jtemp + "°F", 163, 43);
			c.fillText(jhum + "%", 163, 54);
			c.fillText(jindex + "°F", 163, 65);
			c.fillText(jgust, 163, 76);
			c.fillText(jwind, 163, 87);
			//console.log(jgust);
			
			// draw text bottom left
			c.beginPath();
			c.moveTo(35.5, window.innerHeight - (yax*2 - 0.5));
			c.lineTo(35.5, window.innerHeight - 43.5);
			c.lineTo(105.5, window.innerHeight - 43.5);
			c.lineTo(105.5, window.innerHeight - (yax*2 - 0.5));
			c.closePath();
			c.lineWidth = 1;
			c.strokeStyle = "rgb(25, 35, 30)";
			c.stroke();
			c.fillStyle = "rgb(25, 35, 30)";
			c.font = "bold 9px Arial";
			c.textAlign = "left";
			c.textBaseline = "alphabetic";
			c.fillText(currentTemp + "°F", 53, window.innerHeight - 26);
			
			// draw text bottom right
			c.beginPath();
			c.moveTo(window.innerWidth - 35.5, window.innerHeight - (yax*2 - 0.5));
			c.lineTo(window.innerWidth - 35.5, window.innerHeight - 43.5);
			c.lineTo(window.innerWidth - 105.5, window.innerHeight - 43.5);
			c.lineTo(window.innerWidth - 105.5, window.innerHeight - (yax*2 - 0.5));
			c.closePath();
			c.lineWidth = 1;
			c.strokeStyle = "rgb(25, 35, 30)";
			c.stroke();
			c.fillStyle = "rgb(25, 35, 30)";
			c.font = "bold 9px Arial";
			c.textAlign = "left";
			c.textBaseline = "alphabetic";
			c.fillText(currentHum + "%", window.innerWidth - 87, window.innerHeight - 26);
			
			// rectangles
			c.fillRect(4, yy, 12, 6);
			c.fillRect(window.innerWidth - 16, yy, 12, 6);
			
		}, spin);
		c.restore();
	}
	
	// draw increments
	function paramz()
	{
		/*c.lineWidth = 6;
		c.strokeStyle = "rgb(25, 35, 30)";
		c.beginPath();
		c.moveTo(0, 0);
		c.lineTo(0, window.innerHeight);
		c.stroke();
		c.beginPath();
		c.moveTo(window.innerWidth, 0);
		c.lineTo(window.innerWidth, window.innerHeight);
		c.stroke();*/
		//console.log(window.innerHeight);
		var i;
		for(i = 0; i < window.innerHeight; i += yax)
		{
			c.lineWidth = 0.5;
			c.beginPath();
			c.moveTo(4.5, window.innerHeight - (i + 0.5));
			c.lineTo(16.5, window.innerHeight - (i + 0.5));
			c.stroke();
			c.beginPath();
			c.moveTo(window.innerWidth-3.5, window.innerHeight - (i + 0.5));
			c.lineTo(window.innerWidth-15.5, window.innerHeight - (i + 0.5));
			c.stroke();
			c.lineWidth = 1;
			c.beginPath();
			c.moveTo(Math.floor(window.innerWidth/2)-0.5, i);
			c.lineTo(Math.floor(window.innerWidth/2)-0.5, i-(yax-4.5));
			c.stroke();
		}
	}	
	
	function tempLines()
	{
		// draw tempLines
		/*xTemp = new tempLine(0, (window.innerHeight - temp) - 0.5, window.innerWidth/2, (window.innerHeight - index) - 0.5);  
		xTemp.drawLine(c);
		xHum = new tempLine(window.innerWidth, (window.innerHeight - (hum * 1.057)) - 0.5, window.innerWidth/2, (window.innerHeight - index) - 0.5);
		xHum.drawLine(c);*/
		//console.log(temp);
		//console.log(index);
		c.beginPath();
		c.arc(window.innerWidth/2, (window.innerHeight - index) - 0.5, 24, 0, 2 * Math.PI, false);
		c.closePath();
		c.lineWidth = 5;
		c.strokeStyle = "rgb(25, 35, 30)";
		c.fillStyle = "rgb(245, 250, 250)";
		c.stroke();
		c.fill();
		c.font = "11px Arial";
		c.textAlign = "center";
		c.textBaseline = "middle";
		c.fillStyle = "rgb(25, 35, 30)";
		c.fillText(jindex + "°F", window.innerWidth/2, (window.innerHeight - index) - 0.5);
	}