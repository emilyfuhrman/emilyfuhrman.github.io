var generate = function() {

	return {
		map:{},
		width:window.innerWidth,
		height:window.innerHeight,

		retina:window.devicePixelRatio > 1,
		
		panelW:360,	//set in CSS
		stopR:3.5,
		stopY:156,	//stopline padding from top
		paddW:45,	//stopline padding on left and right of available space

		color_black:'#191919',
		color_accent:'#3690c0',
		color_gold:'#bfbf37',
		color_gray:'#aaa',

		line:d3.svg.line(),
		stopScale:d3.scale.linear(),

		loading:[],

		data:{},
		stopData:{},

		maxDay:10,

		transitionTime:200,

		loadingManager:function(id){
			var self = vis;

			//remove ID from loading array
			self.loading = self.loading.filter(function(d){
				return d !== id;
			});

			//if only thing in array is 'tiles'
			if(self.loading.length === 1 && self.loading.indexOf('tiles') >-1){
				self.processData();
				self.drawMap();
				self.drawNav();
			}

			//if array is empty (if all data has been fetched),draw map
			if(self.loading.length === 0){
				self.fadeIn();
			}
		},
		fadeIn:function(){
			var self = vis;
			d3.select('#loading')
				.transition()
				.duration(self.transitionTime)
				.style('opacity',0)
				.style('visibility','hidden')
				;
			d3.selectAll('#target, .nav.footer')
				.style('pointer-events','all')
				.transition()
				.duration(self.transitionTime)
				.style('opacity',1)
				;
		},
		getData:function(){

			var self = vis;

			//center loading animation
			d3.select('#loading')
				.style('width',self.width -360 +'px');

			//hold tiles in loading array
			self.loading.push('tiles');

			function fetchJSON_GEO(id){
				var filestring = 'data/' +id +'.geojson';
				
				//push into loading array
				self.loading.push(id);

				d3.json(filestring,function(collection){
					self.data[id] = {};
					self.data[id].data = collection;
					self.loadingManager(id);
				});
			}

			function fetchJSON(id){
				var filestring = 'data/' +id +'.json';
				
				//push into loading array
				self.loading.push(id);

				d3.json(filestring,function(d){
					self.data[id] = d;
					self.loadingManager(id);
				});
			}

			fetchJSON_GEO('borders');
			fetchJSON_GEO('locations');

			fetchJSON('stops');

			//cycle through all possible 24-hour ranges
			d3.range(0,self.maxDay).forEach(function(d,i){
				var index   = i +1,
					indexID = index <10 ? 'day_0' +index : 'day_' +index;
				fetchJSON_GEO(indexID);
			});
		},
		processData:function(){
			var self = vis,
				dist = 0;

			self.line
				.x(function(d){ return d.x; })
				.y(function(d){ return d.y; })
				.interpolate('linear')
				;

			//set stopline parameters
			self.stopScale
				.domain([0,d3.sum(self.data.stops.stops,function(d,i){ return d.distDiff; })])
				.range([self.panelW +self.paddW, self.width -self.paddW]);

			//store positions
			self.data.stops.stops.forEach(function(d,i){
				self.stopData[d.id] = {};
				self.stopData[d.id].posX = dist +d.distDiff;
				dist +=d.distDiff;
			});
		},
		drawNav:function(){
			var self = vis;
			var footer,

				_data = self.data.stops.stops,

				stopG,
				stopBacks,
				stops,
				stopLabels,
				stopLine,
				stopLineG,

				legendG,
				legendHead,
				legendHeadRect,
				legendLinesRect,
				legendLineG,
				legendRectBacks,
				legendRects,
				legendLabels;

			footer = d3.select('.footer')
				.append('svg')
				.attr('width',self.width)
				.attr('height',self.height);

			//group for stopline
			stopLineG = footer.selectAll('g.stopLineG')
				.data([self]);
			stopLineG.enter().append('g')	
				.classed('stopLineG',true);
			stopLineG.exit().remove();

			//background line
			stopLine = stopLineG.selectAll('line.stopLine')
				.data([self]);
			stopLine.enter().append('line')	
				.classed('stopLine',true);
			stopLine
				.attr('x1',self.panelW +self.paddW)
				.attr('x2',self.width -self.paddW)
				.attr('y1',self.stopY)
				.attr('y2',self.stopY);
			stopLine.exit().remove();

			//stop dots
			stopG = stopLineG.selectAll('g')
				.data(_data);
			stopG.enter().append('g');
			stopG
				.attr('class',function(d,i){
					return d.id;
				})
				.classed('known',function(d,i){
					return d.known;
				})
				.attr('transform',function(d,i){
					var x = self.stopScale(self.stopData[d.id].posX),
						y = self.stopY;
					return 'translate(' +x +',' +y +')';
				});
			stopG
				.on('click',function(d,i){
				})
				.on('mouseover',function(d,i){
					self.scrollTo(d.id);
					self.focus(d.id);
				})
				.on('mousemove',function(d,i){
				})
				.on('mouseout',function(d,i){
					self.unfocus();
				});
			stopG.exit().remove();
			stopBacks = stopG.selectAll('rect.stopBack')
				.data(function(d){ return [d]; });
			stopBacks.enter().append('rect')
				.classed('stopBack',true);
			stopBacks
				.attr('x',function(d,i){
					var idx = _data.indexOf(d),
						dupeL = _data[idx+1] && _data[idx +1].distDiff === 0,
						dupeR = idx !== 0 && d.distDiff === 0;
					return dupeL ? 0 : dupeR ? -15 : -7.5;
				})
				.attr('y',-120)
				.attr('width',15)
				.attr('height',138);
			stopBacks.exit().remove();
			stops = stopG.selectAll('circle.stop')
				.data(function(d){ return [d]; });
			stops.enter().append('circle')
				.classed('stop',true);
			stops
				.attr('r',function(d,i){
					var idx = _data.indexOf(d),
						dupeL = _data[idx+1] && _data[idx +1].distDiff === 0,
						dupeR = idx !== 0 && d.distDiff === 0;
					return dupeL ? (self.stopR*2.5) : dupeR ? self.stopR : self.stopR;
				})
				.attr('cx',0)
				.attr('cy',0)
				.style('stroke',function(d,i){
					return d.known ? self.color_accent : self.color_gray;
				});
			stops.exit().remove();
			stopLabels = stopG.selectAll('text.stopLabel')
				.data(function(d){ return [d]; });
			stopLabels.enter().append('text')
				.classed('stopLabel',true);
			stopLabels
				.attr('x',26)
				.attr('y',function(d,i){

					//handle overlapping labels (if distance btw. destinations === 0)
					var idx = _data.indexOf(d),
						dupeL = _data[idx+1] && _data[idx+1].distDiff === 0,
						dupeR = idx !== 0 && d.distDiff === 0;
					return dupeL ? (self.stopR*2) +3.5 : dupeR ? -self.stopR : self.stopR;
				})
				.attr('transform','rotate(270)')
				.text(function(d){
					return d.name;
				})
				.style('fill',function(d,i){
					return d.known ? self.color_accent : self.color_gray;
				});;
			stopLabels.exit().remove();

			//group for legend
			var legendW = 130,
				legendRectH = self.stopR*4;

			legendG = footer.selectAll('g.legendG')
				.data([self]);
			legendG.enter().append('g')	
				.classed('legendG',true);
			legendG
				.attr('transform',function(d,i){
					var x = self.panelW +self.paddW,
						y = self.height -self.stopY -39;
					return 'translate(' +x +',' +y +')';
				});
			legendG.exit().remove();

			legendHeadRect = legendG.selectAll('rect.legendHeadRect')
				.data([self]);
			legendHeadRect.enter().append('rect')
				.classed('legendHeadRect',true);
			legendHeadRect
				.attr('x',0)
				.attr('y',-30)
				.attr('width',legendW)
				.attr('height',30)
				.style('stroke-width',function(d){
					return self.retina ? 0.5 : 1;
				});
			legendHeadRect.exit().remove();
			legendHead = legendG.selectAll('text.header')
				.data(['key']);
			legendHead.enter().append('text')
				.classed('header',true);
			legendHead
				.attr('x',12)
				.attr('y',-12)
				.text(function(d){ return d; });
			legendHead.exit().remove();

			legendLinesRect = legendG.selectAll('rect.legendLinesRect')
				.data([self]);
			legendLinesRect.enter().append('rect')
				.classed('legendLinesRect',true);
			legendLinesRect
				.attr('x',0)
				.attr('y',-30)
				.attr('width',legendW)
				.attr('height',15*(self.maxDay +1) +6)
				.style('stroke-width',function(d){
					return self.retina ? 0.5 : 1;
				});
			legendLinesRect.exit().remove();
			legendLineG = legendG.selectAll('g.legendLineG')
				.data(d3.range(0,self.maxDay));
			legendLineG.enter().append('g')
				.classed('legendLineG',true);
			legendLineG
				.attr('transform',function(d,i){
					var x = 12,
						y = (i +1)*(legendRectH/2 +self.stopR) +3;
					return 'translate(' +x +',' +y +')';
				});
			legendLineG.exit().remove();
			legendRectBacks = legendLineG.selectAll('rect.legendRectBack')
				.data(function(d){ return [d]; });
			legendRectBacks.enter().append('rect')
				.classed('legendRectBack',true);
			legendRectBacks
				.attr('class',function(d,i){
					return '_' +(d +1) +' legendRectBack';
				})
				.attr('x',87)
				.attr('y',0)
				.attr('width',legendRectH)
				.attr('height',legendRectH/2)
			legendRectBacks.exit().remove();
			legendRects = legendLineG.selectAll('rect.legendRect')
				.data(function(d){ return [d]; });
			legendRects.enter().append('rect')
				.classed('legendRect',true);
			legendRects
				.attr('class',function(d,i){
					return '_' +(d +1) +' legendRect';
				})
				.attr('x',87)
				.attr('y',0)
				.attr('width',legendRectH)
				.attr('height',legendRectH/2)
			legendRects.exit().remove();
			legendLabels = legendLineG.selectAll('text.legendLabel')
				.data(function(d){ return [d]; });
			legendLabels.enter().append('text')
				.classed('legendLabel',true);
			legendLabels
				.attr('x',0)
				.attr('y',(self.stopR*2))
				.text(function(d,i){
					var num = (d +1);
					return num === 1 ? num +' day' : num === self.maxDay ? num +' days' : '';
				});
			legendLabels.exit().remove();

			//add lil stop dot entry
			var dot;
			dot = legendG.append('g')
				.classed('legendLineG',true)
				.attr('transform',function(d,i){
					var x = 12,
						y = (self.maxDay +2)*(legendRectH/2 +self.stopR);
					return 'translate(' +x +',' +y +')';
				});
			dot.append('circle')
				.classed('location',true)
				.attr('cx',94)
				.attr('cy',0)
				.attr('r',2.5);
			dot.append('text')
				.classed('legendLabel',true)
				.attr('x',0)
				.attr('y',self.stopR)
				.text('known stop');
		},
		drawMap:function(){
			var self = vis;

			/*	LEAFLET SETUP 
				============================================================== */

			self.map = new L
				.map('target', {
					center:[28.20760859532738,62.2705078125],
                    zoom:6,
					minZoom:6,
					maxZoom:6,
					zoomControl:false,
					dragging:false,
					trackResize:false
                });

            //allows concurrent calls (faster tile loading)
            var subdomains = ['a', 'b', 'c', 'd'];
			var tile_settings = {
				subdomains:subdomains
			}

			//pull in custom Mapbox tile layer
			var tiles_MB = 'https://{s}.tiles.mapbox.com/v4/xxzvx.3ct2zkt9/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoieHh6dngiLCJhIjoiVGZyNjdqUSJ9.o9lzL_jn5fXdOhiP5HnokA';
			var tileLayer = L.tileLayer(tiles_MB);

			tileLayer.addTo(self.map);
			tileLayer.on('load',function(){ self.loadingManager('tiles'); });

			/*	CONSTRUCTORS 
				============================================================== */

			//with projectPoint(), create a d3.geo.path to convert GeoJSON to SVG
			var transform = d3.geo.transform({ point:projectPoint }),
				path = d3.geo.path().projection(transform);

			//adapt Leaflet to fit D3 -- via: http://bost.ocks.org/mike/leaflet/
			function projectPoint(x,y){
				var point  = self.map.latLngToLayerPoint(new L.LatLng(y,x));
				this.stream.point(point.x,point.y);
			}

			function projectCoordinates(x,y){
				return self.map.latLngToLayerPoint(new L.LatLng(y,x));
			}

			function constructGeoJSONLayer(data,index,clss){
				var elemClass  = 'points_' +index,
					elemSelect = 'points.' +elemClass;
				var points = g.selectAll(elemSelect)
					.data(data.features)
					;
				points.enter().append('path')
					.classed(elemClass,true);
				points
					.attr('class',function(d){
						return elemClass +' ' +clss +' _' +index;
					})
					.attr('d',path);
				points.exit().remove();
			}

			/*	D3/SVG STUFF 
				============================================================== */

			//add SVG container
			var svg = d3.select(self.map.getPanes().overlayPane).append('svg'),
				g   = svg.append('g').attr('class','leaflet-zoom-hide');

			//add country labels
			var labelData = [
					{ 'coords':[29.000,57.500], 'name':'Iran' },
					{ 'coords':[31.507,63.500], 'name':'Afghanistan' },
					{ 'coords':[29.207,68.270], 'name':'Pakistan' },
					{ 'coords':[25.000,74.250], 'name':'India' }
				],
				labels;
			labels = g.selectAll('text.label')
				.data(labelData);
			labels.enter().append('text')
				.classed('label',true);
			labels
				.attr('x',function(d){
					var pt = projectCoordinates(d.coords[1],d.coords[0]);
					return pt.x;
				})
				.attr('y',function(d){
					var pt = projectCoordinates(d.coords[1],d.coords[0]);
					return pt.y;
				})
				.text(function(d){
					return d.name;
				});
			labels.exit().remove();

			constructGeoJSONLayer(self.data.borders.data,'','border');

			d3.range(0,self.maxDay).forEach(function(_d,_i){
				var _index   = _i +1,
					_indexID = _index <10 ? 'day_0' +_index : 'day_' +_index,
					_data  = self.data[_indexID].data,
					_class = 'walking-region';
				constructGeoJSONLayer(_data,_index,_class);
			});

			svg
				.attr('width',self.width)
				.attr('height',self.height);

			var locationG,
				locations,
				locationLink,
				locationLabel,

				locationData = self.data.locations.data.features;

			var elem_move = locationData.filter(function(d){ return d.properties.id === 'rask'; })[0],
				elem_idx = locationData.indexOf(elem_idx);
			locationData = locationData.filter(function(d){ return d.properties.id !== 'rask'; });
			locationData.unshift(elem_move);

			locationG = g.selectAll('g')
				.data(locationData);
			locationG.enter().append('g');
			locationG
				.attr('class',function(d,i){
					return d.properties.id;
				})
				.attr('transform',function(d,i){
					var _x = d.geometry.coordinates[0],
						_y = d.geometry.coordinates[1],
						pt = projectCoordinates(_x,_y);
					return 'translate(' +pt.x +',' +pt.y +')';
				});
			locationG
				.on('click',function(d,i){
				})
				.on('mouseover',function(d,i){
					self.scrollTo(d.properties.id);
					self.focus(d.properties.id);
				})
				.on('mousemove',function(d,i){ 
				})
				.on('mouseout',function(d,i){
					self.unfocus();
				});
			locationG.exit().remove();
			locationLink = locationG.selectAll('path.locationLink')
				.data(function(d){ return [d]; });
			locationLink.enter().append('path')
				.classed('locationLink',true);
			locationLink
				.attr('class',function(d){
					return 'locationLink ' +d.properties.id;
				})
				.attr('d',function(d){
					var _x = d.geometry.coordinates[0],
						_y = d.geometry.coordinates[1],
						pt = projectCoordinates(_x,_y),

						stopPos = d.properties.id !== 'NULL' ? self.stopScale(self.stopData[d.properties.id].posX) : 0,

						ang = Math.PI/6,
						dif = stopPos -pt.x;

					var	lineData = [
							{'x':0,'y':0},
							{'x':0,'y':-pt.y +(self.stopY +30) +Math.abs(Math.tan(ang)*dif)},
							{'x':dif,'y':-pt.y +(self.stopY +30)},
							{'x':dif,'y':-pt.y +self.stopY}
						];
					return self.line(lineData);
				});
			locationLink.exit().remove();
			locations = locationG.selectAll('circle.location')
				.data(function(d){ return [d]; });
			locations.enter().append('circle')
				.classed('location',true);
			locations
				.attr('cx',0)
				.attr('cy',0)
				.attr('r',2.5)
				;
			locations.exit().remove();

			//returns ID of closest stop to mouse position
			function findClosest(_lat,_lng){
				var stops = self.data.locations.data.features,
					dists = [],
					close;
				stops.forEach(function(d,i){
					var obj = {},
						lat = d.geometry.coordinates[1],
						lng = d.geometry.coordinates[0];
					obj.dist = Math.sqrt(Math.pow((lat -_lat),2) +Math.pow((lng -_lng),2));
					obj.id = d.properties.id;
					dists.push(obj);
				});
				close = dists.sort(function(a,b){ return a.dist -b.dist; })[0];
				return close.id;
			}

			//stop areas
			g.selectAll('path.walking-region')
				.on('mouseover',function(d,i){
					var lat = self.map.mouseEventToLatLng(d3.event).lat,
						lng = self.map.mouseEventToLatLng(d3.event).lng,
						id  = findClosest(lat,lng);
					self.scrollTo(id);
					self.focus(id);
				})
				.on('mousemove',function(d,i){
				})
				.on('mouseout',function(d,i){
					self.unfocus();
				});

			d3.selectAll('#panel h4')
				.on('click',function(d,i){
					//self.scrollTo(this.className);
				})
				.on('mouseover',function(d,i){
					d3.selectAll('.focus').classed('focus',false);
					if(this.parentNode.className.length >0){
						self.focus(this.parentNode.className);
					}
				})
				.on('mousemove',function(d,i){
					//self.focus(this.parentNode.className);
				})
				.on('mouseout',function(d,i){
					self.unfocus();
				});
		},
		scrollTo:function(_id){
			var self = vis,
				select = $('#panel div#' +_id),
				panel  = $('#panel .descrip'),
				end    = select.offset().top -$('div.title').height() +panel.scrollTop();

			$('.focus').removeClass('focus');
			select.addClass('focus');

			panel.stop();
			panel
				.scrollTo(end,{
					duration:self.transitionTime,
					easing:'easeOutQuad'
				});
		},
		focus:function(_id){
			var self = vis;

			//d3.selectAll('.focus').classed('focus',false);
			d3.selectAll('.highlight').classed('highlight',false);
			d3.selectAll('.' +_id).classed('highlight',true);
			d3.selectAll('.' +_id +' .locationLink, .' +_id +' .stop')
				.style('stroke',self.color_gold);
			d3.select('.' +_id +' .stopLabel')
				.style('fill',self.color_gold);
			d3.select('.' +_id +' .location')
				.attr('r',4.25)
				.style('stroke',self.color_gold)
				.style('stroke-width',7);
		},
		unfocus:function(){
			var self = vis;
			d3.selectAll('.highlight').classed('highlight',false);
			d3.selectAll('.locationLink')
				.style('stroke',self.color_accent);
			d3.selectAll('.stop')
				.style('stroke',function(d){
					return d.known ? self.color_accent : self.color_gray;
				});
			d3.selectAll('.footer .stopLabel')
				.style('fill',function(d){
					return d.known ? self.color_accent : self.color_gray;
				});
			d3.selectAll('.location')
				.attr('r',2.5)
				.style('stroke',self.color_accent)
				.style('stroke-width',3.5);
		}
	}
}

var vis = generate();
vis.getData();

window.onclick = function(e){
	//console.log(vis.map.getCenter());
}
window.onresize = function(e){
}

//detect actual mouse scroll vs. the scrollTo() function
$('#panel .descrip').bind('scroll mousedown wheel DOMMouseScroll mousewheel keyup', function(e){
	if ( e.which > 0 || e.type == "mousedown" || e.type == "mousewheel"){
		d3.selectAll('.highlight').classed('highlight',false);
		d3.selectAll('.focus').classed('focus',false);
	}
});