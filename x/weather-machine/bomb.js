function bomb(angle, radius, radi, speed)
{
	this.angle	= angle;
	this.radius	= radius;
	this.radi  	= radi;
	this.speed	= speed;
}

bomb.prototype.drawBomb = function(c)
{
	var i;
	for(i = 0; i < 71; i++)
	{
		this.angle += this.speed*3;
		c.fillStyle = "rgb(25, 35, 30)";
		c.beginPath();
		//c.arc(Math.sin(this.angle)*this.radius, Math.cos(this.angle)*this.radius, this.radi, 0, 2 * Math.PI, false);
		c.closePath();
		c.lineWidth = 0.5;
		c.beginPath();
		c.moveTo(0, 0);
		c.lineTo(Math.sin(this.angle + 60)*this.radius, Math.cos(this.angle + 60)*this.radius);
		c.lineTo(Math.sin(this.angle + 360)*this.radius, Math.cos(this.angle + 360)*this.radius);
		c.closePath();
		c.strokeStyle = "rgb(185, 195, 190)";
		c.stroke();
		c.fill();
	}
}
