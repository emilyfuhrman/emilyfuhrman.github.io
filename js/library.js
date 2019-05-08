var lib = function(){

	return {

		data_list:[],

		elem_library:null,

		get_data:function(){
			var self = this;
			d3.json('/data/library.json',function(e,d){
				if(!e){ 
					self.data_list = d;
					self.generate_chassis();
					self.generate_list(d); 
				}
			});
		},

		generate_chassis:function(){
			var self = this;
			self.elem_library = d3.select('#library');

			var header_row = self.elem_library.append('div').classed('header row',true);
			header_row.append('span').classed('itemAuth',true).text("Author(s)");
			header_row.append('span').classed('itemDate',true).text("Date");
			header_row.append('span').classed('itemName',true).text("Title");
		},

		generate_list:function(_data){
			var self = this;
			var data = _data || [];

			var items,
					itemAuth,
					itemDate,
					itemName;

			items = self.elem_library.selectAll('div.item')
				.data(data);
			items.enter().append('div')
				.classed('item',true);
			items
				.classed('row',true);
			items.exit().remove();

			itemAuth = items.selectAll('span.itemAuth')
				.data(function(d){ return [d]; });
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
				.data(function(d){ return [d]; });
			itemDate.enter().append('span')
				.classed('itemDate',true);
			itemDate
				.html(function(d){ return '<pre>' +d.date +'</pre>'; });
			itemDate.exit().remove();
			
			itemName = items.selectAll('span.itemName')
				.data(function(d){ return [d]; });
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

lib().get_data();