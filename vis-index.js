var w = window.innerWidth,
	h = window.innerHeight,
	node,
	link,
	root;

var force = d3.layout.force()
	.on("tick", tick)
	.charge(-300)
	.linkDistance(60)
	.friction(0.8)
	.size([w, h]);

var svg = d3.select("#chart").append("svg:svg")
	.attr("id", "galaxy")
	.attr("width", w)
	.attr("height", h);

d3.json("data/projects.json", function(json) {
	root = json;
	update();
});

function update()
{
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
		//.style("stroke-width", 1)
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
	 		.attr("r", function(d) { return d.title === "" ? 2.5 : 4; }) 
	  		.attr("onclick", function(d) { return "location.href='" + d.link + "';"; })
	  		.attr("cursor", function(d) {return d.title === "" ? "default" : "cell"; })
	 		.call(force.drag);
	  	
	 	
	node.exit().remove();

	// tooltip
	$('circle.node').tipsy({
	gravity: 'w',
	html: true,
	fade: true,
	title: function() 
	{
		var d = this.__data__, t = d.title; 
		return t;
	}
	});
	
	var n = nodes.length;
	nodes.forEach(function(d, i) {
	d.x = d.y = w / n * i;
	});
}

function tick()
{
	link.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });
	 	
	node.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });
}

function flatten(root)
{
	var nodes = [], i = 0;
	
	function recurse(node)
	{
		if (node.children) node.children.forEach(recurse);
		if (!node.id) node.id = ++i;
		nodes.push(node);
	}
	
	recurse(root);
	return(nodes);
}








