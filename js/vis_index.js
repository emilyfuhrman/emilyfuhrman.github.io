var init = function(){

	return {

		data:{ "name":"projects", "children": [] },
		formatData:function(posts){

			var self = this,
				branches = [];

			//create nested json structure
			posts.forEach(function(d){
				var proj = {
						"id":parseInt(d.num),
						"path":d.path,
						"title":d.title,
						"category":d.cat
					},
					t_01 = d.tier_01.split("_")[1],
					t_02 = d.tier_02 !== "null" ? d.tier_02.split("_")[1] : null;
					i_01 = self.data.children.indexOf(self.data.children.filter(function(d){ return d.name === t_01; })[0]);
				if(i_01 <0 && !t_02){
					self.data.children.push({
						"name":t_01,
						"children":[proj]
					});
				} else if(i_01 <0 && t_02){
					var proj_subset = {
						"name":t_02,
						"children":[proj]
					};
					self.data.children.push({
						"name":t_01,
						"children":[proj_subset]
					});
				} else if(i_01 >-1 && t_02){
					var i_02 = self.data.children[i_01].children.indexOf(self.data.children[i_01].children.filter(function(d){ return d.name === t_02; })[0]);
					if(i_02 >-1){
						self.data.children[i_01].children[i_02].children.push(proj);
					} else{
						self.data.children[i_01].children.push({
							"name":t_02,
							"children":[proj]
						});
					}
				} else{
					self.data.children[i_01].children.push(proj);
				}
			});
			this.generate(self.data);
		},
		generate:function(data){

			var self = this,
				w = window.innerWidth,
				h = window.innerHeight,
				node,
				link,
				root;

			var force = d3.layout.force()
				.on("tick", tick)
				.charge(-3000)
				.linkDistance(120)
				.friction(0.8)
				.size([w, h]);

			var svg = d3.select("#chart").append("svg:svg")
				.attr("id", "galaxy")
				.attr("width", w)
				.attr("height", h);

			root = self.data;
			update();

			function update(){

				var nodes = flatten(root),
					links = d3.layout.tree().links(nodes);
				
				force
					.nodes(nodes)
					.links(links)
					.start();
				
				link = svg.selectAll("line.link")
					.data(links, function(d) { return d.target.id; });
					
				link.enter().insert("svg:line", ".node")
					.attr("class", "link")
					.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });
				
				link.exit().remove();
				
				node = svg.selectAll("circle.node")
					.data(nodes);
				
				node.enter()
					.append("svg:circle")
				 		.classed("node", true)
				 		.classed("joint", function(d){ return d.title ? false : true; })
				 		.attr("cx", function(d) { return d.x; })
						.attr("cy", function(d) { return d.y; })
				 		.attr("r", function(d) { return d.title ? 87 : 0; }) 
				  		.attr("onclick", function(d) { 
				  			if(!d3.select(this).classed('joint')){
					  			var end = d.category === "projects" ? ".html" : "";
					  			return "location.href='" + d.category + "/" + d.path + end + "';"; 
				  			}
				  		})
				  		.attr("cursor", function(d) { return d.title ? "cell" : "crosshair"; })
				 		.call(force.drag);

				node.exit().remove();

				// tooltip
				$('circle.node').tipsy({
				gravity: 'w',
				html: true,
				fade: true,
				title: function() 
				{
					var d = this.__data__, 
						t = d.title || ""; 
					return t;
				}
				});
				
				var n = nodes.length;
				nodes.forEach(function(d, i) {
				d.x = d.y = w / n * i;
				});
			}

			function tick(){

				link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });
				 	
				node.attr("cx", function(d) { return d.x; })
					.attr("cy", function(d) { return d.y; });
			}

			function flatten(root){

				var nodes = [], i = 0;
				
				function recurse(node){

					if (node.children) node.children.forEach(recurse);
					if (!node.id) node.id = ++i;
					nodes.push(node);
				}
				
				recurse(root);
				return(nodes);
			}
		}
	}
}

var vis = init();
vis.formatData(JEKYLL_POSTS);