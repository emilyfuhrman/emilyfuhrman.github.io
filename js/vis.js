var schema = function(){

	return {
		posts:JEKYLL_POSTS,
		golden:(1+Math.sqrt(5))/2,
		transitionTime:200,
		vertices:{
			1:{vx:0,vy:0,x:0,y:0},
			2:{vx:0,vy:0,x:0,y:0},
			3:{vx:0,vy:0,x:0,y:0},
			4:{vx:0,vy:0,x:0,y:0}
		},
		generate:function(){
			var self = vis,
				w = window.innerWidth,
				h = window.innerHeight
				oX = w/2,
				oY = h/2;

			function setPointStart(){
				var dX = (w*1.25)/self.golden,
					dY = (h*1.25)/self.golden;
				self.vertices[1].vx = w -dX;
				self.vertices[1].vy = h -dY;
				self.vertices[2].vx = w -dX;
				self.vertices[2].vy = dY;
				self.vertices[3].vx = dX;
				self.vertices[3].vy = h -dY;
				self.vertices[4].vx = dX;
				self.vertices[4].vy = dY;
			}

			function setPointEnd(){
				
				//number of posts?
				self.vertices[1].x = oX -100;
				self.vertices[1].y = oY +200;

				self.vertices[2].x = oX -500;
				self.vertices[2].y = oY +100;
				self.vertices[3].x = oX +300;
				self.vertices[3].y = oY -100;
				self.vertices[4].x = oX +100;
				self.vertices[4].y = oY +100;
			}

			var svg = d3.select('#vis')
				.selectAll('svg')
				.data([self]);
			svg.enter().append('svg');
			svg.exit().remove();

			//draw vertices
			var verticesG,
				vertL,
				vertR;

			//half the width/height of one vertex
			var sq = 36;

			setPointStart();
			setPointEnd();

			verticesG = svg.selectAll('g.vertex')
				.data(d3.entries(self.vertices));
			verticesG.enter().append('g')
				.classed('vertex',true)
				.attr('transform',function(d,i){
					var x = d.value.vx,
						y = d.value.vy;
					return 'translate(' + x + ',' + y + ')';
				});
			verticesG
				.transition()
				.delay(500)
				.ease('backs')
				.duration(self.transitionTime)
				.attrTween('transform',function(d,i){
					var vx = d.value.vx,
						vy = d.value.vy,
						x  = d.value.x,
						y  = d.value.y,
						string1 = 'translate(' + vx + ',' + vy + ')',
						string2 = 'translate(' + x  + ',' + y  + ')';
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
			vertBack.exit().remove();
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
			vertR.exit().remove();
			vertL.exit().remove();
			verticesG.exit().remove();
		}
	}
}

var vis = schema();
vis.generate();