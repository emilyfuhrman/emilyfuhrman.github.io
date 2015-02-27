var schema = function(){

	return {
		transitionTime:215,
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
				var dX = 350,
					dY = 150;
				self.vertices[1].vx = oX -dX;
				self.vertices[1].vy = oY -dY;
				self.vertices[2].vx = oX -dX;
				self.vertices[2].vy = oY +dY;
				self.vertices[3].vx = oX +dX;
				self.vertices[3].vy = oY -dY;
				self.vertices[4].vx = oX +dX;
				self.vertices[4].vy = oY +dY;
			}

			function setPointEnd(){
				self.vertices[1].x = oX -100;
				self.vertices[1].y = oY -100;
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