function tempLine(x1, y1, x2, y2)
{
	this.x1	 = x1;
	this.y1	 = y1;
	this.x2  = x2;
	this.y2	 = y2;
}

tempLine.prototype.drawLine = function(c)
{
	c.lineWidth = 0.5;
	c.beginPath();
	c.moveTo(this.x1, this.y1);
	c.lineTo(this.x2, this.y2);
	c.strokeStyle = "rgb(165, 175, 170)";
	c.stroke();
	
	// draw side paramz
	c.lineWidth = 6;
	c.strokeStyle = "rgb(25, 35, 30)";
	c.beginPath();
	c.moveTo(0, 0);
	c.lineTo(0, window.innerHeight);
	c.stroke();
	c.beginPath();
	c.moveTo(window.innerWidth, 0);
	c.lineTo(window.innerWidth, window.innerHeight);
	c.stroke();
}