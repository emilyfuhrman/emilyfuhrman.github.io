var init = function(){

	return {
		iw: 303, 		//320 -1 margin and -16 padding
		cw: 1280, 		//default container width
		ch: 600,		//default container height
		wn: 4,			//default # images in one row
		maxImages:24,	//maximum number of images on one page
		currentPage:1,
		toppad: 129,
		floors: [],
		images: [],
		visible: [],
		makeRequest:function(callback){
			d3.json("data/floorplans.json", function(data){
				var _data = data.reverse();
				callback(_data);
			});
		},
		reqSuccess:function(data){
			var self = insta,
				data = data || [];
			data.forEach(function(d,i){

				var x = new Image();

				//add floor to floor list
				if(self.floors.filter(function(_d){return _d.floor === d.floor;}).length === 0){
					var obj = { "id":d.floor,"floor":d.floor }
					self.floors.push(obj);
				}
				x.src = "imgs/" +d.ext +".jpg";

				x.ext = d.ext;
				x.floor = d.floor;
				x.address = d.address;
				x.city = d.city;
				x.state = d.state;

				x.width = self.iw;
				x.height = self.iw;

				self.images.push(x);
			});
			//self.visible = self.images;
			//self.renderNav();
			self.renderPagination();
			self.renderImages(self.currentPage);
		},
		renderNav:function(){
			var self = this,
				data = self.floors,
				btns;

			//src: http://stackoverflow.com/questions/4340227/sort-mixed-alpha-numeric-array
			var reA = /[^a-zA-Z]/g;
			var reN = /[^0-9]/g;
			function sortAlphaNum(a,b) {
			    var aA = a.floor.replace(reA, "");
			    var bA = b.floor.replace(reA, "");
			    if(aA === bA) {
			        var aN = parseInt(a.floor.replace(reN, ""), 10);
			        var bN = parseInt(b.floor.replace(reN, ""), 10);
			        return aN === bN ? 0 : aN > bN ? 1 : -1;
			    } else {
			        return aA < bA ? 1 : -1;
			    }
			}
			data = data.sort(sortAlphaNum);
			data.push({"id":"all","floor":"&#8617"});

			btns = d3.select("#nav .cont")
				.selectAll("div.btn")
				.data(data);
			btns.enter().append("div")
				.classed("btn",true)
				.classed("texty",true)
				;
			btns
				.style("margin-top",function(d,i){
					return i === 0 ? 0 : "3px";
				})
				.html(function(d){
					return d.floor;
				})
				.on("click",function(d){
					self.visible = d.id === "all" ? self.images : self.images.filter(function(_d){return _d.floor === d.floor;});
					d3.selectAll(".btn").classed("selected",false);
					if(d.id !== "all"){
						d3.select(this).classed("selected",true);
					}
					self.renderImages();
				})
				;
			btns.exit().remove();
		},
		renderPagination:function(){
			var self = this;

			//add page numbers if..
			if(self.images.length >self.maxImages){

				var numpages = Math.ceil(self.images.length/self.maxImages),
					data = [];

				for(var i=0; i<numpages; i++){
					data.push(i+1);
				}
				
				var pagenums = d3.select("#nav .cont")
					.selectAll("div.pagenum")
					.data(data);
				pagenums.enter().append("div")
					.classed("pagenum",true);
				pagenums
					.attr("class",function(d,i){
						return i === 0 ? "pagenum current" : "pagenum";
					})
					.html(function(d){
						return d;
					})
					.on("click",function(d,i){
						d3.selectAll(".pagenum.current").classed("current",false);
						d3.select(this).classed("current",true);
						self.currentPage = d;
						self.renderImages(self.currentPage);
					});
				pagenums.exit().remove();
			}
		},
		renderImages:function(currentPage){

			//start at top
			window.scrollTo(0,0);

			var self = this,
				data,
				instacont,
				instadivs,
				instahovs,
				instaimgs;

			//separate out visible images
			self.visible = [];
			var cutoff = (currentPage*self.maxImages) >self.images.length ? self.images.length : (currentPage*self.maxImages);
			for(var i=((currentPage -1)*self.maxImages); i<cutoff; i++){
				self.visible.push(self.images[i]);
			}
			data = self.visible;

			self.sizeContainer();

			instadivs = d3.select("div#imgs")
				.selectAll("div.insta")
				.data(data);
			instadivs.enter().append("div")
				.classed("insta",true);
			instadivs
				.attr("class",function(d){
					return "insta _" +d.ext;
				})
				.on("mouseover",function(d){
					d3.selectAll("._" +d.ext)
						.classed("over",true);
					self.markerMove(d.top,d.left);
				})
				.on("mouseout",function(d){
					d3.selectAll("._" +d.ext)
						.classed("over",false);
					self.markerMove(data[0].top,data[0].left);
				});
			instadivs
				.exit()
				.remove();

			this.positionDivs(instadivs);

			//add images
			instaimgs = instadivs
				.selectAll("img.indexed")
				.data(function(d){return [d];});
			instaimgs.enter().append("img")
				.classed("indexed",true);
			instaimgs
				.attr("src",function(d,i){
					return d.src;
				})
				.attr("class",function(d){
					return "indexed _" +d.ext;
				})
				.style("width",function(d){
					return self.iw +"px";
				})
				.style("height",function(d){
					return self.iw +"px";
				});
			instaimgs.exit().remove();

			//add hidden hoverable divs
			instahovs = instadivs
				.selectAll("div.hov")
				.data(function(d){return [d];});
			instahovs.enter().append("div")
				.classed("hov",true);
			instahovs
				.attr("class",function(d){
					return "hov _" +d.ext;
				})
				.html(function(d){
					return "<b>" +d.address + "</b></br>" +d.city + ", " +d.state;
				})
				.style("width",function(d){
					return self.iw +"px";
				});
			instahovs.exit().remove();
		},
		positionDivs:function(selection){
			var self = this,
				divs = selection || d3.selectAll("div.insta"),
				padd = (window.innerWidth -self.cw)/2,
				imgw = insta.iw +1 +16;

			function newxpos(d,i){
				var l = (i%self.wn)*imgw +padd;
				return l;
			}

			function newypos(d,i){
				var row = Math.floor(i/self.wn),
					t = (row*imgw) +self.toppad;
				return t;
			}

			divs
				.style("left",function(d,i){
					d.left = newxpos(d,i);
					return d.left +"px";
				})
				.style("top",function(d,i){
					d.top = newypos(d,i);
					return d.top +"px";
				});
		},
		sizeContainer:function(){

			var self = this,
				ww = window.innerWidth;

			//take into account 60px horizontal padding
			//insta.cw is container width
			//insta.wn is # of squares crossing pg
			if(ww >=1340){
				self.cw = 1280;
				self.wn = 4;
			} else if(ww >=1020 && ww <1340){
				self.cw = 960;
				self.wn = 3;
			} else if(ww >=700 && ww <1020) {
				self.cw = 640;
				self.wn = 2;
			} else{
				self.cw = 320;
				self.wn = 1;
			}

			d3.select("div#imgs")
				.style("width",(self.cw +"px"))
				.style("height",function(){
					var h = Math.ceil(self.visible.length/self.wn)*(self.iw +1 +16) +self.toppad;
					self.ch = h;
					return h +"px";
				});

			self.sizeMap();
		},
		sizeMap:function(){
			var self = this;

			d3.select("#footer")
				.style("display",function(){
					return self.cw === 320 ? "none" : "block";
				})
				.style("width",function(d){
					return (self.cw*.15) +"px";
				})
				.style("height",function(d){
					var h = Math.ceil(self.visible.length/self.wn)*(self.iw +1 +16);
					return (h*.15) +"px";
				})
				/*.style("max-height",function(){
					return window.innerHeight -124 +"px";
				})*/
				;
		},
		//requires top and left coords
		markerMove:function(top,left){
			var self = insta;
			d3.select("#footer .marker")
				.style("top",function(){
					return (top -self.toppad)*.15 +"px";
				})
				.style("left",function(){
					var l = left -(window.innerWidth -insta.cw)/2;
					return l*.15 +"px";
				});
		}
	}
}

var insta = init();
insta.makeRequest(insta.reqSuccess);

$(window).resize(function(){
	insta.markerMove(insta.images[0].top,insta.images[0].left);
	insta.sizeContainer();
	insta.positionDivs();
});
