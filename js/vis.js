var schema = function(){

	return {
		posts:JEKYLL_POSTS,
		golden:(1+Math.sqrt(5))/2,
		transitionTime:240,
		delay:720,
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
		date_weekdays:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
		date_month:["January","February","March","April","May","June","July","August","September","October","November","December"],
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
					dX = (w*1.15)/self.golden,
					dY = (h*1.15)/self.golden,

					//absolute values of sin(a) and cos(a)
					sinA = Math.abs(Math.sin(a)),
					cosA = Math.abs(Math.cos(a)),

					//current date values
					d = new Date(),
					thisD = self.date_weekdays[d.getDay()],
					thisM = self.date_month[d.getMonth()],
					thisY = d.getFullYear(),
					thisS = getSeason(d.getMonth());

				function getSeason(m){
					var s;
					if(m === 11 || m === 1 || m === 2){
						s = 'winter';
					} else if(m === 3 || m === 4  || m === 5){
						s = 'spring';
					} else if(m === 6 || m === 7  || m === 8){
						s = 'summer';
					} else if(m === 9 || m === 10 || m === 11){
						s = 'fall';
					}
					return s;
				}

				var totalImages = [];
				self.posts.forEach(function(d,i){
					if(d.images){
						d.images.forEach(function(_d,_i){ totalImages.push(_d); })
					}
				});

				//set all ceilings to total # posts
				//artificially shorten this limit for now
				d3.entries(self.vertices).forEach(function(_d,_i){
					self.vertices[_d.key].limit = self.posts.length*0.4;
				});

				//get actual values, paired with descriptive labels
				self.vertices.v1.value = d3.values(self.posts).filter(function(_d,_i){
					return self.date_month[parseInt(_d.month) -1] === thisM;
				}).length;
				self.vertices.v1.label = "in the month of <span class='emph'>" +thisM +'</span>';

				self.vertices.v2.value = d3.values(self.posts).filter(function(_d,_i){
					return _d.day === thisD;
				}).length;
				self.vertices.v2.label = "on a <span class='emph'>" +thisD +'</span>';

				self.vertices.v3.value = d3.values(self.posts).filter(function(_d,_i){
					return getSeason(parseInt(_d.month)) === thisS;
				}).length;
				self.vertices.v3.label = "in the calendar season of <span class='emph'>" +thisS +'</span>';

				self.vertices.v4.value = d3.values(self.posts).filter(function(_d,_i){
					return parseInt(_d.year) === thisY;
				}).length;
				self.vertices.v4.label = "in <span class='emph'>" +thisY +'</span>';

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
					self.positions[d.key][0].y = (hF*h) + (-1.5*yF*(sq*2));

					//state1 (toggle hF to opp. of state0 value)
					self.positions[d.key][1].x = (wF*w) + (xF*dX);
					self.positions[d.key][1].y = ((1 -hF)*h) + (yF*dY);

					//state2
					self.positions[d.key][2].x = oX + ( xF*(cosA*(self.positions[d.key].u*self.vertices[d.key].value)) );
					self.positions[d.key][2].y = oY + ( yF*(sinA*(self.positions[d.key].u*self.vertices[d.key].value)) );
				});
			}
			function hoverOver(d){
				var val = d.value,
					hovTransitionTime = self.transitionTime/3;

				originG
					.style('opacity',1);
				vertArc
					.transition()
					.ease('linear')
					.delay(hovTransitionTime*4)
					.duration(hovTransitionTime)
					.styleTween('stroke-dashoffset',function(){
						var n1 = d3.select(this).node().getTotalLength(),
							n2 = 0;
						return d3.interpolate(n1,n2);
					});
				vertSeg
					.transition()
					.ease('linear')
					.delay(hovTransitionTime*2)
					.duration(hovTransitionTime)
					.styleTween('stroke-dashoffset',function(){
						var n1 = d3.select(this).node().getTotalLength(),
							n2 = 0;
						return d3.interpolate(n1,n2);
					});
				d3.select('.legend')
					.style('opacity',1);
				d3.select('.legend-descrip')
					.html(function(){
						var num = self.vertices[d.key].value,
							str = self.vertices[d.key].label,
							copy = num === 1 ? 'project published' : 'projects published';
						return '<span class="emph">' +num +'</span> ' +copy +' ' +str;
					});
				d3.selectAll('._' +d.key +', .unitbar').classed('selected',true);
			}
			function hoverOut(){
				originG
					.style('opacity',0);
				vertArc
					.transition()
					.delay(0)
					.duration(0)
					.styleTween('stroke-dashoffset',function(){
						var n1 = 0,
							n2 = d3.select(this).node().getTotalLength();
						return d3.interpolate(n1,n2);
					});
				vertSeg
					.transition()
					.delay(0)
					.duration(0)
					.styleTween('stroke-dashoffset',function(){
						var n1 = 0,
							n2 = d3.select(this).node().getTotalLength();
						return d3.interpolate(n1,n2);
					});
				d3.select('.legend')
					.style('opacity',0);
				d3.select('.legend-descrip')
					.html('');
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
				vertSeg,
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
				//.ease('linear')
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
				.duration(self.transitionTime*0.5)
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

			vertArc = verticesG.selectAll('path.arc')
				.data(function(d){ return [d]; });
			vertArc.enter().append('path')
				.classed('arc',true);
			vertArc
				.attr('class',function(d){
					return 'arc markup _' +d.key;
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
					var r, tx, ty, 
						arcar = (3*sq)/4,
						angle = a*(180/Math.PI);

					//rotate arcs to orient towards origin
					//translate arcs to intersect X's
					if(d.key === 'v1'){
						tx = arcar;
						ty = arcar;
						r  = -(45 -angle);
					} else if(d.key === 'v2'){
						tx = -arcar;
						ty = arcar;
						r  = 45 -angle;
					} else if(d.key === 'v3'){
						tx = -arcar;
						ty = -arcar;
						r  = -(45 -angle);
					} else if(d.key === 'v4'){
						tx = arcar;
						ty = -arcar;
						r  = 45 -angle;
					}
					return 'rotate(' +r +')translate(' +tx +',' +ty +')';
				})
				.style('stroke-dasharray',function(){
					var totalLength = d3.select(this).node().getTotalLength();
					return totalLength +' ' +totalLength;
				})
				.style('stroke-dashOffset',function(){
					var totalLength = d3.select(this).node().getTotalLength();
					return totalLength;
				});

			vertSeg = verticesG.selectAll('path.seg')
				.data(function(d){ return [d]; });
			vertSeg.enter().append('path')
				.classed('seg',true);
			vertSeg
				.attr('class',function(d,i){
					return 'seg markup _' +d.key;
				})
				.attr('d',function(d){
					var m1, m2, l1, l2,
						ext = 72,
						len = self.positions[d.key].u*self.vertices[d.key].value,
						str,

						//absolute values of sin(a) and cos(a)
						sinA = Math.abs(Math.sin(a)),
						cosA = Math.abs(Math.cos(a)),

						x1 = cosA*ext,
						y1 = sinA*ext,

						x2 = cosA*(len +ext),
						y2 = sinA*(len +ext);

					if(d.key === 'v1'){
						m1 = -x1;
						m2 = -y1;
						l1 =  x2;
						l2 =  y2;
					} else if(d.key === 'v2'){
						m1 =  x1;
						m2 = -y1;
						l1 = -x2;
						l2 =  y2;
					} else if(d.key === 'v3'){
						m1 =  x1;
						m2 =  y1;
						l1 = -x2;
						l2 = -y2;
					} else if(d.key === 'v4'){
						m1 = -x1;
						m2 =  y1;
						l1 =  x2;
						l2 = -y2;
					}

					str = 'M ' +m1 +',' +m2 +' L ' +l1 +',' +l2;
					return str;
				})
				.style('stroke-dasharray',function(){
					var totalLength = d3.select(this).node().getTotalLength();
					return totalLength +' ' +totalLength;
				})
				.style('stroke-dashOffset',function(){
					var totalLength = d3.select(this).node().getTotalLength();
					return totalLength;
				});
			vertSeg.exit().remove();

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
			var osq = 32,
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
				.data([self]);
			unitBars.enter().append('div')
				.classed('unitbar',true);
			unitBars
				.style('width',function(d,i){
					//units are all the same now
					var units = d3.entries(self.positions.v1).filter(function(_d,_i){ return _d.key === 'u'; })[0].value;
					return Math.round(units) +'px';
				})
				.style('top',function(d,i){
					var offset = 43;
					return offset -1 +'px';
				});
			unitBars.exit().remove();
		}
	}
}

var vis = schema();
vis.generate();