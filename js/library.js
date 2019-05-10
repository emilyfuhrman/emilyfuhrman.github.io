var lib = function(){

	return {

		focus:"read",
		order:"desc",

		palette:['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],

		data_list:[],
		data_columns:[
			{
				"id":"cats",
				"label":"🗂"
			},
			{
				"id":"star",
				"label":"&#9733;"
			},
			{
				"id":"read",
				"label":"🏁"
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
		data_tags:{
			"biology": [
					"animal behavior",
					"birds"
				],
			"data visualization": [
					"bar charts",
					"color",
					"dot charts",
					"graphical perception",
					"line charts"
				],
			"mapping":[
					"critical cartography"
				],
			"math": [
					"statistics"
				],
			"philosophy": [
					"aesthetics"
				]
		},

		active_cats:[],
		active_tags:[],

		elem_library:null,

		util_switchOrder:function(){
			var self = this;
			if(self.order === 'asc'){
				self.order = 'desc';
			} else{
				self.order = 'asc';
			}
		},

		util_sortData:function(_data){
			var self = this;

			function sorter(a,b){
				if(a == b) return 0;
				if(a <  b) return self.order === 'asc' ?  1 : -1;
				if(a >  b) return self.order === 'asc' ? -1 :  1;
			}

			if(self.focus === 'authors'){
				var iter = d3.max(_data,function(d){ return d[self.focus].length; });
				var a_comp,
						b_comp;
				for(var i=(iter-1); i>-1; i--){
					_data.sort(function(a,b){
						a_comp = a[self.focus][i] ? a[self.focus][i].ln : 'A';
						b_comp = b[self.focus][i] ? b[self.focus][i].ln : 'A';
						return sorter(a_comp,b_comp);
					});
				}
			} else if(self.focus === 'cats'){
				for(var i=d3.keys(self.data_tags).length; i>-1; i--){
					var k = d3.keys(self.data_tags)[i];
					_data.sort(function(a,b){
						a_comp = a[self.focus][k] || 0;
						b_comp = b[self.focus][k] || 0;
						return sorter(a_comp,b_comp);
					});
				};
			} else{
				_data.sort(function(a,b){
					a_comp = a[self.focus] || null;
					b_comp = b[self.focus] || null;
					return sorter(a_comp,b_comp);
				});
			}
			return _data;
		},

		util_filterData:function(_data){
			var self = this,
					data;
			data = _data.filter(function(d){
				var keep = false;
				if(self.active_tags.length === 0){
					keep = true;
				} else{
					d.tags.forEach(function(_d){
						if(self.active_tags.filter(function(__d){ return __d.label === _d; }).length >0){ keep = true; }
					});
				}
				return keep;
			});
			return data;
		},

		get_data:function(){
			var self = this;
			d3.json('/data/library.json',function(e,d){
				if(!e){ 
					self.data_list = self.process_data(d);
					self.generate_chassis();
					self.generate_tags();
					self.generate_list(); 
				}
			});
		},

		process_data:function(_data){
			var self = this;
			_data.forEach(function(d){
				d.cats = {};
				d3.keys(self.data_tags).forEach(function(_d,_i){
					d.cats[_d] = d.tags.filter(function(__d){ return self.data_tags[_d].indexOf(__d) >-1; }).length / d.tags.length;
				});
			});
			return _data;
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

					self.generate_list();
				});
			header_items.exit().remove();
		},

		generate_tags:function(){
			var self = this;
			var tags,
					tagList = [];

			//create flattened list of tags w/color
			d3.keys(self.data_tags).forEach(function(d,i){
				self.data_tags[d].forEach(function(_d,_i){
					tagList.push({
						"label":_d,
						"category":d,
						"color":self.palette[i]
					});
				});
			});

			//sort alphabetically
			tagList.sort(function(a,b){
				if(a.label == b.label)
					return  0;
				if(a.label <b.label)
					return -1;
				if(a.label >b.label)
					return  1;
			});
			//sort by category
			tagList.sort(function(a,b){
				if(a.category == b.category)
					return  0;
				if(a.category <b.category)
					return -1;
				if(a.category >b.category)
					return  1;
			});

			var cats,
					tags;

			function updateTags(){
				if(self.active_tags.length >0){
					d3.select('#btn_clear').classed('hidden',false);
				} else{
					d3.select('#btn_clear').classed('hidden',true);
				}
				cats.classed('active',function(d){
					return self.active_cats.indexOf(d) >-1;
				});
				tags.classed('active',function(d){
					return self.active_tags.indexOf(d) >-1;
				});
			}

			cats = d3.select('#controls .cats').selectAll('div.library-cat')
				.data(d3.keys(self.data_tags));
			cats.enter().append('div')
				.classed('library-cat',true);
			cats
				.text(function(d){ return d; })
				.style('background',function(d,i){ return self.palette[i]; });
			cats
				.on('click',function(d){
					if(self.active_cats.indexOf(d) <0){
						self.active_cats.push(d);
						self.active_tags = self.active_tags.concat(tagList.filter(function(_d){ return _d.category === d; }));
					} else{
						self.active_cats = self.active_cats.filter(function(_d){ return _d !== d; });
						self.active_tags = self.active_tags.filter(function(_d){ return _d.category !== d; });
					}
					updateTags();
					self.generate_list();
				});
			cats.exit().remove();

			tags = d3.select('#controls .tags').selectAll('div.library-tag')
				.data(tagList);
			tags.enter().append('div')
				.classed('library-tag',true);
			tags
				.text(function(d){ return d.label; })
				.style('background',function(d){ return d.color; });
			tags
				.on('click',function(d){
					if(self.active_tags.filter(function(_d){ return _d.label === d.label; }).length === 0){
						self.active_tags.push(d);
						if(self.active_tags.filter(function(_d){ return _d.category === d.category; }).length === self.data_tags[d.category].length){
							self.active_cats.push(d.category);
						}
					} else{
						self.active_tags = self.active_tags.filter(function(_d){ return _d !== d; });
						self.active_cats = self.active_cats.filter(function(_d){ return _d !== d.category; });
					}
					updateTags();
					self.generate_list();
				});
			tags.exit().remove();

			d3.select('#btn_clear').on('click',function(){
				self.active_tags = [];
				self.active_cats = [];
				updateTags();
				self.generate_list();
			});
		},

		generate_list:function(){
			var self = this;
			var data = self.data_list;

			data = self.util_sortData(data);
			data = self.util_filterData(data);

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
						var barW = 33;
						if(d.id === 'star'){
							html = _d.star ? "<span class='fill'>&#9733;</span>" : "&#9734;";
						} else if(d.id === 'cats'){
							var divConstructor = "<div class='databar'>";
							d3.keys(self.data_tags).forEach(function(__d,__i){
								var catW = _d.cats[__d]*barW;
								divConstructor += "<div style='width:" +catW +"px;background:" +self.palette[__i] +"'></div>"
							});
							html = divConstructor +"</div>";
						} else if(d.id === 'read'){
							html = _d.read ? '☑️' : '⬜️';
						} else if(d.id === 'type'){
							html = _d.type === 'book' ? '📖' : '📄';
						} else if(d.id === 'authors'){
							var len = _d.authors.length,
									str = '';
							_d.authors.forEach(function(__d,__i){ str +=(__d.ln +(__d.fi ? (', ' +__d.fi) : '') +(len >1 && (__i+1) <len ? '; ' : '')); });
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