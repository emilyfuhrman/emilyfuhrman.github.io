var schema = function(){

	return {
		posts:JEKYLL_POSTS,
		golden:(1+Math.sqrt(5))/2,
		transitionTime:175,
		delay:525,
		pause:350,
		positions:{
			1:{ 0:{x:0,y:0},
				1:{x:0,y:0},
				2:{x:0,y:0} },
			2:{ 0:{x:0,y:0},
				1:{x:0,y:0},
				2:{x:0,y:0} },
			3:{ 0:{x:0,y:0},
				1:{x:0,y:0},
				2:{x:0,y:0} },
			4:{ 0:{x:0,y:0},
				1:{x:0,y:0},
				2:{x:0,y:0} }
		},
		generate:function(){
			var self = vis,
				w = window.innerWidth,
				h = window.innerHeight,

				//half the width/height of one vertex	
				sq = 36;

			function setPointPos(){
				var oX = w/2,
					oY = h/2,
					dX = (w*1.25)/self.golden,
					dY = (h*1.25)/self.golden;

				var totalImages = [];
				self.posts.forEach(function(d,i){
					if(d.images){
						d.images.forEach(function(_d,_i){ totalImages.push(_d); })
					}
				});

				var d1 = self.posts.length,		//total # posts
					d2 = totalImages.length,	//total # images in posts
					d3 = new Date().getTime();	//current time in milliseconds

				//state 0
				self.positions[1][0].x = w -dX;
				self.positions[1][0].y = 0 -(sq*2);
				self.positions[2][0].x = w -dX;
				self.positions[2][0].y = h +(sq*2);
				self.positions[3][0].x = dX;
				self.positions[3][0].y = 0 -(sq*2);
				self.positions[4][0].x = dX;
				self.positions[4][0].y = h +(sq*2);

				//state 1
				self.positions[1][1].x = w -dX;
				self.positions[1][1].y = h -dY;
				self.positions[2][1].x = w -dX;
				self.positions[2][1].y = dY;
				self.positions[3][1].x = dX;
				self.positions[3][1].y = h -dY;
				self.positions[4][1].x = dX;
				self.positions[4][1].y = dY;

				//state2
				self.positions[1][2].x = oX -100;
				self.positions[1][2].y = oY +200;
				self.positions[2][2].x = oX -500;
				self.positions[2][2].y = oY +100;
				self.positions[3][2].x = oX +300;
				self.positions[3][2].y = oY -100;
				self.positions[4][2].x = oX +100;
				self.positions[4][2].y = oY +100;
			}

			setPointPos();

			var svg = d3.select('#vis')
				.selectAll('svg')
				.data([self]);
			svg.enter().append('svg');
			svg.exit().remove();

			//draw vertices
			var verticesG,
				vertL,
				vertR;

			verticesG = svg.selectAll('g.vertex')
				.data(d3.entries(self.positions));
			verticesG.enter().append('g')
				.classed('vertex',true)
				.attr('transform',function(d,i){
					var x = self.positions[d.key][0].x,
						y = self.positions[d.key][0].y;
					return 'translate(' + x + ',' + y + ')';
				});
			verticesG
				.transition()
				.delay(self.delay)
				.ease('sin-out')
				.duration(self.transitionTime)
				.attrTween('transform',function(d,i){
					var x1 = self.positions[d.key][0].x,
						y1 = self.positions[d.key][0].y,
						x2 = self.positions[d.key][1].x,
						y2 = self.positions[d.key][1].y;
					var string1 = 'translate(' + x1 + ',' + y1 + ')',
						string2 = 'translate(' + x2 + ',' + y2 + ')';
					return d3.interpolateString(string1,string2);
				})
				.transition()
				.delay(self.delay +self.transitionTime +self.pause)
				//.duration(self.transitionTime)
				.attrTween('transform',function(d,i){
					var x1 = self.positions[d.key][1].x,
						y1 = self.positions[d.key][1].y,
						x2 = self.positions[d.key][2].x,
						y2 = self.positions[d.key][2].y;
					var string1 = 'translate(' + x1 + ',' + y1 + ')',
						string2 = 'translate(' + x2 + ',' + y2 + ')';
					return d3.interpolateString(string1,string2);
				});
			vertBack = verticesG.selectAll('rect')
				.data(function(d){ return [d]; });
			vertBack.enter().append('rect');
			vertBack
				.attr('x',-sq)
				.attr('y',-sq)
				.attr('width',sq*2)
				.attr('height',sq*2)
				;
			vertL = verticesG.selectAll('path.L')
				.data(function(d){ return [d]; });
			vertL.enter().append('path')
				.classed('L',true);
			vertL
				.attr('d',function(d){
					var pathString = 'M -' +sq + ', -' +sq +' L ' +sq +', ' +sq;
					return pathString;
				});
			vertR = verticesG.selectAll('path.R')
				.data(function(d){ return [d]; });
			vertR.enter().append('path')
				.classed('R',true);
			vertR
				.attr('d',function(d){
					var pathString = 'M -' +sq + ', ' +sq +' L ' +sq +', -' +sq;
					return pathString;
				});
			verticesG.exit().remove();
			vertBack.exit().remove();
			vertL.exit().remove();
			vertR.exit().remove();
		}
	}
}

var vis = schema();
vis.generate();