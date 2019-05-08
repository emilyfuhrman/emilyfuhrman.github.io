var lib = function(){

	return {

		getData:function(){
			var self = this;
			d3.json('/data/library.json',function(e,d){
				if(!e){ self.generate(d); }
			});
		},

		generate:function(_data){
			var self = this;
			var list = _data || [];

			var items,
					itemAuth,
					itemDate,
					itemName;

			items = d3.select('#library').selectAll('div.item')
				.data(list);
			items.enter().append('div')
				.classed('item',true);
			items.exit().remove();

			itemAuth = items.selectAll('span.itemAuth')
				.data(list);
			itemAuth.enter().append('span')
				.classed('itemAuth',true);
			itemAuth
				.text(function(d){ 
					var len = d.authors.length,
							str = '';
					d.authors.forEach(function(_d,_i){ str +=(_d.ln +', ' +_d.fi +(len >1 && (_i+1) <len ? '; ' : '')); });
					return str;
				});
			itemAuth.exit().remove();
			
			itemDate = items.selectAll('span.itemDate')
				.data(list);
			itemDate.enter().append('span')
				.classed('itemDate',true);
			itemDate
				.html(function(d){ return '<pre>' +d.date +'</pre>'; });
			itemDate.exit().remove();
			
			itemName = items.selectAll('span.itemName')
				.data(list);
			itemName.enter().append('span')
				.classed('itemName',true);
			itemName
				.html(function(d){ 
					var str_link = "<a href='/documents/" +d.path +".pdf' target='_blank'>" +d.name +"</a>";
					return str_link; 
				});
			itemName.exit().remove();
		}
	}
}

lib().getData();