function vane(_posx, _posy, _angle, _wind)
{
	this.x		= _posx;
	this.y		= _posy;
	this.angle	= _angle;
	this.wind	= _wind;
}

vane.prototype.drawVane = function(c)
{
	c.save();
	c.translate(this.x, this.y);
	c.beginPath();
	if(this.wind === "NORTH")
	{
		c.moveTo(0, 0);
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) - 15, Math.cos(this.angle + (Math.PI/180)));
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) + 15, Math.cos(this.angle + (Math.PI/180)));
		c.lineTo(0, 0);
	}
	else if(this.wind === "SOUTH")
	{
		c.moveTo(0, 0);
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) - 15, Math.cos(this.angle + (Math.PI/180)));
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) + 15, Math.cos(this.angle + (Math.PI/180)));
		c.lineTo(0, 0);
	}
	else if(this.wind === "EAST")
	{
		c.moveTo(0, 0);
		c.lineTo(Math.sin(this.angle + (Math.PI/180)), Math.cos(this.angle + (Math.PI/180)) + 15);
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)), Math.cos(this.angle + (Math.PI/180)) - 15);
		c.lineTo(0, 0);
	}
	else if(this.wind === "WEST")
	{
		c.moveTo(0, 0);
		c.lineTo(Math.sin(this.angle + (Math.PI/180)), Math.cos(this.angle + (Math.PI/180)) + 15);
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)), Math.cos(this.angle + (Math.PI/180)) - 15);
		c.lineTo(0, 0);
	}
	else if(this.wind === "NE")
	{
		c.moveTo(0, 0);
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) + 9, Math.cos(this.angle + (Math.PI/180)) + 15);
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)), Math.cos(this.angle + (Math.PI/180)) - 21);
		c.lineTo(0, 0);
	}
	else if(this.wind === "SE")
	{
		c.moveTo(0, 0);
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) + 9, Math.cos(this.angle + (Math.PI/180)) - 15);
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)), Math.cos(this.angle + (Math.PI/180)) + 18);
		c.lineTo(0, 0);
	}
	else if(this.wind === "NW")
	{
		c.moveTo(0, 0);
		c.lineTo(Math.sin(this.angle + (Math.PI/180)), Math.cos(this.angle + (Math.PI/180)) - 15);
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) - 6, Math.cos(this.angle + (Math.PI/180)) + 18);
		c.lineTo(0, 0);
	}
	else if(this.wind === "SW")
	{
		c.moveTo(0, 0);
		c.lineTo(Math.sin(this.angle + (Math.PI/180)), Math.cos(this.angle + (Math.PI/180)) + 15);
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)), Math.cos(this.angle + (Math.PI/180)) - 21);
		c.lineTo(0, 0);
	}
	else if(this.wind === "ENE")
	{
		c.moveTo(0, 0);
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) + 12, Math.cos(this.angle + (Math.PI/180)) + 12);
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) - 12, Math.cos(this.angle + (Math.PI/180)) - 12);
		c.lineTo(0, 0);
	}
	else if(this.wind === "NNE")
	{
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) + 12, Math.cos(this.angle + (Math.PI/180)) + 12);
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) - 12, Math.cos(this.angle + (Math.PI/180)) - 12);
	}
	else if(this.wind === "WNW")
	{
		c.moveTo(0, 0);
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) - 12, Math.cos(this.angle + (Math.PI/180)) - 18);
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) + 6, Math.cos(this.angle + (Math.PI/180)) + 18);
		c.lineTo(0, 0);
	}
	else if(this.wind === "NNW")
	{
		c.moveTo(0, 0);
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) + 6, Math.cos(this.angle + (Math.PI/180)) - 18);
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) - 12, Math.cos(this.angle + (Math.PI/180)) + 18);
		c.lineTo(0, 0);
	}
	else if(this.wind === "ESE")
	{
		c.moveTo(0, 0);
		c.lineTo(Math.sin(this.angle + (Math.PI/180)), Math.cos(this.angle + (Math.PI/180)) - 18);
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)), Math.cos(this.angle + (Math.PI/180)) + 18);
		c.lineTo(0, 0);
	}
	else if(this.wind === "SSE")
	{
		c.moveTo(0, 0);
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) + 15, Math.cos(this.angle + (Math.PI/180)));
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) - 18, Math.cos(this.angle + (Math.PI/180)));
		c.lineTo(0, 0);
	}
	else if(this.wind === "WSW")
	{
		c.moveTo(0, 0);
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) - 15, Math.cos(this.angle + (Math.PI/180)) - 9);
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) + 15, Math.cos(this.angle + (Math.PI/180)) + 15);
		c.lineTo(0, 0);
	}
	else if(this.wind === "SSW")
	{
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) - 15, Math.cos(this.angle + (Math.PI/180)) - 9);
		c.lineTo(Math.sin(this.angle + (Math.PI/180))*(bombRad/4), Math.cos(this.angle + (Math.PI/180))*(bombRad/4));
		c.lineTo(Math.sin(this.angle + (Math.PI/180)) + 9, Math.cos(this.angle + (Math.PI/180)) + 15);
	}
	c.closePath();
	c.fillStyle = "rgb(25, 35, 30)";
	c.lineWidth = 0.5;
	c.strokeStyle = "rgb(185, 195, 190)";
	c.stroke();
	c.fill();
	c.restore();
}