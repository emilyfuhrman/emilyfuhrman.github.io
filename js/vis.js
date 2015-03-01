var schema = function(){

	return {
		posts:JEKYLL_POSTS,
		golden:(1+Math.sqrt(5))/2,
		transitionTime:120,
		delay:480,
		pause:240,
		vertices:{
			v1:{},
			v2:{},
			v3:{},
			v4:{}
		},
		positions:{
			v1:{0:{x:0,y:0},
				1:{x:0,y:0},
				2:{x:0,y:0},
				u:0 },
			v2:{0:{x:0,y:0},
				1:{x:0,y:0},
				2:{x:0,y:0},
				u:0 },
			v3:{0:{x:0,y:0},
				1:{x:0,y:0},
				2:{x:0,y:0},
				u:0 },
			v4:{0:{x:0,y:0},
				1:{x:0,y:0},
				2:{x:0,y:0},
				u:0 }
		},
		generate:function(){
			var self = vis,
				w = window.innerWidth,
				h = window.innerHeight,

				//central angle from which to triangulate positions (keep radians)
				a = Math.atan(h/w),

				//length of diagonal from origin to any corner (hypotenuse)
				hyp = Math.sqrt(Math.pow(w,2) +Math.pow(h,2))/2,

				//half the width/height of one vertex	
				sq = 36;

			function setPointPos(d3){

				var oX = w/2,
					oY = h/2,
					dX = (w*1.25)/self.golden,
					dY = (h*1.25)/self.golden,

					//absolute values of sin(a) and cos(a)
					sinA = Math.abs(Math.sin(a)),
					cosA = Math.abs(Math.cos(a));

				var totalImages = [];
				self.posts.forEach(function(d,i){
					if(d.images){
						d.images.forEach(function(_d,_i){ totalImages.push(_d); })
					}
				});

				//set ceilings (mostly arbitrary)
				self.vertices.v1.limit = 40;	
				self.vertices.v2.limit = 90;	
				self.vertices.v3.limit = 100;
				self.vertices.v4.limit = 24;	

				//get actual values
				self.vertices.v1.value = self.posts.length,			//total # posts
				self.vertices.v2.value = new Date().getMinutes(),	//minutes past hour
				self.vertices.v3.value = 50;						//nothing here yet
				self.vertices.v4.value = totalImages.length;		//total # images in posts

				//set accordant units
				d3.entries(self.vertices).forEach(function(d,i){
					self.positions[d.key].u = hyp/d.value.limit;
				});

				//set all positions
				//from offscreen (0), to center square (1), to data-driven (2)
				d3.entries(self.positions).forEach(function(d,i){
					var wF, hF, xF, yF;

					if(d.key === 'v1'){
						wF =  1;
						hF =  0;
						xF = -1;
						yF = -1;
					} else if(d.key === 'v2'){
						wF =  0;
						hF =  0;
						xF =  1;
						yF = -1;
					} else if(d.key === 'v3'){
						wF =  0;
						hF =  1;
						xF =  1;
						yF =  1;
					} else if(d.key === 'v4'){
						wF =  1;
						hF =  1;
						xF = -1;
						yF =  1;
					}

					//state0
					self.positions[d.key][0].x = (wF*w) + (xF*dX);
					self.positions[d.key][0].y = (hF*h) + (yF*(sq*2));

					//state1 (toggle hF to opp. of state0 value)
					self.positions[d.key][1].x = (wF*w) + (xF*dX);
					self.positions[d.key][1].y = ((1 -hF)*h) + (yF*dY);

					//state2
					self.positions[d.key][2].x = oX + ( xF*(cosA*(self.positions[d.key].u*self.vertices[d.key].value)) );
					self.positions[d.key][2].y = oY + ( yF*(sinA*(self.positions[d.key].u*self.vertices[d.key].value)) );
				});
			}
			function hoverOver(d){
				unitBars
					.transition()
					.duration(self.transitionTime)
					.styleTween('width',function(d,i){
						var s1 = d3.select(this).style('width') +'px',
							s2 = Math.round(self.positions[d.key].u) +'px';
						return d3.interpolateString(s1,s2);
					});
				originG
					.transition()
					.delay(self.transitionTime)
					.duration(0)
					.style('opacity',1);
				vertArc
					.transition()
					.duration(self.transitionTime)
					.styleTween('stroke-dashoffset',function(){
						var n1 = d3.select(this).node().getTotalLength(),
							n2 = 0;
						return d3.interpolate(n1,n2);
					});
				d3.selectAll('._' +d.key).classed('selected',true);
			}
			function hoverOut(){
				unitBars
					.transition()
					.duration(self.transitionTime/2)
					.styleTween('width',function(d,i){
						var s1 = d3.select(this).style('width') +'px',
							s2 = 0 +'px';
						return d3.interpolateString(s1,s2);
					});
				originG
					.transition()
					.delay(self.transitionTime/2)
					.duration(0)
					.style('opacity',0);
				vertArc
					.transition()
					.duration(self.transitionTime/2)
					.styleTween('stroke-dashoffset',function(){
						var n1 = d3.select(this).node().getTotalLength(),
							n2 = 0;
						return d3.interpolate(n2,n1);
					});
				d3.selectAll('.selected').classed('selected',false);
			}

			setPointPos(d3);

			var svg = d3.select('#vis')
				.selectAll('svg')
				.data([self]);
			svg.enter().append('svg');
			svg.exit().remove();

			//draw vertices
			var verticesG,
				vertBack,
				vertArc,
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
				.attr('class',function(d,i){
					return 'vertex _' +d.key;
				})
				.transition()
				.delay(self.delay)
				.ease('sin-out')
				.duration(self.transitionTime)
				.attrTween('transform',function(d,i){
					var x1 = self.positions[d.key][0].x,
						y1 = self.positions[d.key][0].y,
						x2 = self.positions[d.key][1].x,
						y2 = self.positions[d.key][1].y;
					var s1 = 'translate(' + x1 + ',' + y1 + ')',
						s2 = 'translate(' + x2 + ',' + y2 + ')';
					return d3.interpolateString(s1,s2);
				})
				.transition()
				.delay(self.delay +self.transitionTime +self.pause)
				.attrTween('transform',function(d,i){
					var x1 = self.positions[d.key][1].x,
						y1 = self.positions[d.key][1].y,
						x2 = self.positions[d.key][2].x,
						y2 = self.positions[d.key][2].y;
					var s1 = 'translate(' + x1 + ',' + y1 + ')',
						s2 = 'translate(' + x2 + ',' + y2 + ')';
					return d3.interpolateString(s1,s2);
				});
			verticesG
				.on('mouseover',function(d){
					hoverOver(d);
				})
				.on('mousemove',function(d){
					return;
				})
				.on('mouseout',function(){
					hoverOut();
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

			vertArc = verticesG.selectAll('path.markup')
				.data(function(d){ return [d]; });
			vertArc.enter().append('path')
				.classed('markup',true);
			vertArc
				.attr('class',function(d){
					return 'markup _' +d.key;
				})
				.attr('d',function(d){
					var m1, c0, c1, c2,
						str;
					if(d.key === 'v1'){
						m1 = [(sq*-2),(sq*2)];
						c0 = [(sq*-2),0];
						c1 = [0,(sq*-2)];
						c2 = [(sq*2),(sq*-2)];
					} else if(d.key === 'v2'){
						m1 = [(sq*-2),(sq*-2)];
						c0 = [0,(sq*-2)];
						c1 = [(sq*2),0];
						c2 = [(sq*2),(sq*2)];
					} else if(d.key === 'v3'){
						m1 = [(sq*2),(sq*-2)];
						c0 = [(sq*2),0];
						c1 = [0,(sq*2)];
						c2 = [(sq*-2),(sq*2)];
					} else if(d.key === 'v4'){
						m1 = [(sq*2),(sq*2)];
						c0 = [0,(sq*2)];
						c1 = [(sq*-2),0];
						c2 = [(sq*-2),(sq*-2)];
					}
					str = 'M ' +m1[0] +',' +m1[1] + ' C ' +c0[0] +',' +c0[1] +' ' +c1[0] +',' +c1[1] +' ' +c2[0] +',' +c2[1];
					return str;
				})
				.attr('transform',function(d,i){
					var r, angle = a*(180/Math.PI);

					//rotate arcs to orient towards origin
					if(d.key === 'v1'){
						r = -(45 -angle);
					} else if(d.key === 'v2'){
						r = 45 -angle;
					} else if(d.key === 'v3'){
						r = -(45 -angle);
					} else if(d.key === 'v4'){
						r = 45 -angle;
					}
					return 'rotate(' + r +')';
				})
				.style('stroke-dasharray',function(){
					var totalLength = d3.select(this).node().getTotalLength();
					return totalLength +' ' +totalLength;
				})
				.style('stroke-dashOffset',function(){
					var totalLength = d3.select(this).node().getTotalLength();
					return totalLength;
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
			verticesG.exit().remove();
			vertBack.exit().remove();
			vertArc.exit().remove();
			vertL.exit().remove();
			vertR.exit().remove();

			//build invisible origin, set size
			var osq = 35,
				originG,
				origin,
				cross;
			originG = svg.selectAll('g.origin')
				.data([[1,2]]);
			originG.enter().append('g')
				.classed('origin',true);
			originG
				.attr('transform',function(d,i){
					var x = w/2 -osq/2,
						y = h/2 -osq/2;
					return 'translate(' + x + ',' + y + ')';
				});
			origin = originG.selectAll('rect')
				.data(function(d){return [d];});
			origin.enter().append('rect');
			origin
				.attr('width',osq)
				.attr('height',osq);
			cross = originG
				.selectAll('path.cross')
				.data(function(d){ return d; });
			cross.enter().append('path')
				.classed('cross',true);
			cross
				.attr('d',function(d,i){
					var p1 = 'M ' +osq/2  +', -' +osq   +' L' +osq/2   +', ' +(osq*2),
						p2 = 'M ' +(-osq) +', '  +osq/2 +' L' +(osq*2) +', ' +(osq/2);
					return i === 0 ? p1 : p2;
				});
			originG.exit().remove();
			origin.exit().remove();
			cross.exit().remove();

			//build legend
			var unitBars = d3.select('.vis.legend')
				.selectAll('div.unitbar')
				.data(d3.entries(self.positions));
			unitBars.enter().append('div')
				.classed('unitbar',true);
			unitBars
				.attr('class',function(d,i){
					return 'unitbar _' +d.key;
				})
				.style('width','0px')
				.style('top',function(d,i){
					//padbot is legend with respect to bottom of page
					//pad is space between entries
					var padbot = 45,
						pad = 15;
					return (i*pad) +padbot -1 +'px';
				});
			unitBars.exit().remove();
		}
	}
}

var vis = schema();
vis.generate();