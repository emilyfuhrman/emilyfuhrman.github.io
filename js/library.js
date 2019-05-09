var lib = function(){

	return {

		focus:"date",
		order:"desc",

		data_list:[],
		data_columns:[
			{
				"id":"read",
				"label":"☑️"
			},
			{
				"id":"type",
				"label":"📁"
			},
			{
				"id":"authors",
				"label":"Author(s)"
			},
			{
				"id":"date",
				"label":"Date"
			},
			{
				"id":"title",
				"label":"Title"
			}
		],

		elem_library:null,

		util_switchOrder:function(){
			var self = this;
			if(self.order === 'asc'){
				self.order = 'desc';
			} else{
				self.order = 'asc';
			}
		},

		util_filterData:function(_data){
			var self = this;
			_data.sort(function(a,b){
				var a_comp = self.focus === 'authors' ? a[self.focus][0].ln : a[self.focus],
						b_comp = self.focus === 'authors' ? b[self.focus][0].ln : b[self.focus];
				if(a_comp == b_comp)
					return 0;
				if(a_comp <b_comp)
					return self.order === 'asc' ?  1 : -1;
				if(a_comp >b_comp)
					return self.order === 'asc' ? -1 :  1;
			});
			return _data;
		},

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

			var header_row,
					header_items;
			header_row = self.elem_library.append('div').classed('header row',true);
			header_items = header_row.selectAll('span.item')
				.data(self.data_columns);
			header_items.enter().append('span')
				.classed('item',true);
			header_items
				.attr('class', function(d){ 
					return 'item item_' +d.id +(d.id === self.focus ? ' focus ' +self.order : ''); 
				})
				.html(function(d){
					return d.label;
				});
			header_items
				.on('click',function(d){
					if(self.focus === d.id){ 
						self.util_switchOrder(); 
					} else{
						self.focus = d.id;
						self.order = 'desc';
					}

					header_items.attr('class', function(d){ 
						return 'item item_' +d.id +(d.id === self.focus ? ' focus ' +self.order : ''); 
					});

					self.generate_list(self.data_list);
				});
			header_items.exit().remove();
		},

		generate_list:function(_data){
			var self = this;
			var data = self.util_filterData(_data);

			var items;
			items = self.elem_library.selectAll('div.item')
				.data(data);
			items.enter().append('div')
				.classed('item',true);
			items
				.classed('row',true);
			items.exit().remove();

			self.data_columns.forEach(function(d){
				var item,
						item_class = 'item_' +d.id;

				item = items.selectAll('span.' +item_class)
					.data(function(_d){ return [_d]; });
				item.enter().append('span')
					.classed(item_class,true);
				item
					.html(function(_d){
						var html;
						if(d.id === 'read'){
							html = _d.read ? '☑️' : '⬜️';
						} else if(d.id === 'type'){
							html = _d.type === 'book' ? '📖' : '📄';
						} else if(d.id === 'authors'){
							var len = _d.authors.length,
									str = '';
							_d.authors.forEach(function(__d,__i){ str +=(__d.ln +', ' +__d.fi +(len >1 && (__i+1) <len ? '; ' : '')); });
							html = str;
						} else if(d.id === 'date'){
							html = '<pre>' +_d.date +'</pre>';
						} else if(d.id === 'title'){
							html = "<a href='/documents/" +_d.path +".pdf' target='_blank'>" +_d.title +"</a>";
						} else{
							html = '';
						}
						return html;
					});
				item.exit().remove();
			});
		}
	}
}

lib().get_data();