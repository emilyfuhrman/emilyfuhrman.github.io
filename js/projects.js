var projects = function(){

	return {

		data:[],
		data_tags:[],
		active_tags:[],

		sort_col:'tag',
		sort_dir:'asc',

		palette:['#E77F6C','#F28394','#E992BD','#CBA8DF','#9DBFF2','#68D4F0','#48E3DB','#66EEB8','#9DF491','#DAF472'],

		tag_dictionary:{
			'animated':'animated',
			'cartography':'cartographies',
			'client':'client work',
			'collaboration':'collaborations',
			'commission':'commissions',
			'compendium':'compendiums',
			'dh':'digital humanities',
			'interactive':'interactive',
			'notation':'graphic notation',
			'static':'static'
		},

		//get original tag based on display label
		tag_reverseLookup:function(_tag){
			var self = this;
			return d3.entries(self.tag_dictionary).filter(function(d){ return d.value === _tag; })[0].key;
		},

		util_sortData:function(_data){
			var self = this;
			var max_l = d3.max(_data,function(d){ return d.tags.length; });

			if(self.sort_col === 'title'){
				_data.sort(function(a,b){ 
					return self.sort_dir === 'asc' ? (a.title <b.title ? -1 : 1) : (a.title <b.title ? 1 : -1); 
				});
			} else if(self.sort_col === 'year'){
				_data.sort(function(a,b){  
					return self.sort_dir === 'asc' ? a.year -b.year : b.year -a.year; 
				});
			} else{

				//default; sort posts by tag
				for(var i=(max_l-1); i>-1; i--){
					_data.sort(function(a,b){
						var a_comp = a.tags.length >=i ? self.data_tags.indexOf(self.tag_dictionary[a.tags[i]]) : -1;
						var b_comp = b.tags.length >=i ? self.data_tags.indexOf(self.tag_dictionary[b.tags[i]]) : -1;
						return self.sort_dir === 'asc' ? a_comp -b_comp : b_comp -a_comp;
					});
				}
			}

			return _data;
		},

		util_filterData:function(_data){
			var self = this,
					data;

			//check whether selected tags (_arr1) are contained within a document's list of tags (_arr2)
			function check_tagMatch(_arr1, _arr2){
				for(var i=0; i<_arr1.length; i++){
					if(_arr2.indexOf(_arr1[i]) === -1){
						return false;
					}
				}
				return true;
			}

			//return intersection of tags
			data = _data.filter(function(d){
				return self.active_tags.length === 0 ? true : check_tagMatch(self.active_tags, d.tags);
			});

			return data;
		},

		get_data:function(){
			var self = this;
			self.data = JEKYLL_POSTS;
			self.process_data(self.data);
		},

		process_data:function(_data){
			var self = this;

			_data.forEach(function(d,i){
				d.tags.forEach(function(_d,_i){
					if(self.data_tags.indexOf(_d) <0){ self.data_tags.push(_d); }
				});
			});
			self.data_tags = self.data_tags.map(d => self.tag_dictionary[d]);
			self.data_tags.sort();

			//sort individual post tags, too
			_data.forEach(function(d){
				d.tags.sort(function(a,b){ 
					var a_comp = self.data_tags.indexOf(self.tag_dictionary[a]);
					var b_comp = self.data_tags.indexOf(self.tag_dictionary[b]);
					return a_comp -b_comp;
				});
			});

			//compute and store tag style data
			_data.forEach(function(d,i){
				d.tags_meta = [];
				d.tags.forEach(function(_d,_i){
					var style_obj = {};
					style_obj.c = self.palette[self.data_tags.indexOf(self.tag_dictionary[_d])];
					style_obj.w = 1/d.tags.length*32;
					d.tags_meta.push(style_obj);
				});
			});

			//check for state-specific parameters in the URL
			var hashArr = window.location.hash.split('&').filter(function(d){ return d !=='#'; }),
					hashStr;
			hashArr.forEach(function(d){
				hashStr = d.split('=');
				if(hashStr[0] === 'tags'){
					var tagList = hashStr[1].split('+');
					self.active_tags = tagList.length >0 && d3.keys(self.tag_dictionary).indexOf(tagList[0]) >-1 ? tagList : [];
				}
				if(hashStr[0] === 'sort'){
					self.sort_col = hashStr[1].split(',')[0];
					self.sort_dir = hashStr[1].split(',')[1];
				}
			});

			self.generate_tags();
			self.generate_list();
		},

		generate_tags:function(){
			var self = this;
			var tags;

			tags = d3.select('#projects .masthead #project-tags').selectAll('div.project-tag')
				.data(self.data_tags);
			tags.enter().append('div')
				.classed('project-tag',true)
				.classed('active',function(d){
					var t = self.tag_reverseLookup(d);
					return self.active_tags.indexOf(t) >-1;
				});
			tags
				.text(function(d){ return d; })
				.style('background',function(d,i){
					return self.palette[i];
				});
			tags
				.on('click',function(d){
					self.update_tags(d);
					self.update_tagDisplay(tags);
					self.update_hash();
					self.generate_list();
				});
			tags.exit().remove();
		},

		update_tagDisplay:function(_handle){
			var self = this;
			var tags = _handle || d3.selectAll('div.project-tag');
			tags.classed('active',function(d){
				var t = self.tag_reverseLookup(d);
				return self.active_tags.indexOf(t) >-1;
			});
		},

		update_tags:function(_newTag){
			var self = this;
			var t = _newTag ? self.tag_reverseLookup(_newTag) : null;
			if(self.active_tags.indexOf(t) <0){
				self.active_tags.push(t);
			} else{
				self.active_tags = self.active_tags.filter(function(_d){ return _d !== t; });
			}
		},

		reset_tagsAndTagDisplay:function(){
			var self = this;
			self.active_tags = [];
			self.update_tagDisplay();
			self.update_hash();
			self.generate_list();
		},

		update_hash:function(){
			var self = this,
					hash = '',
					sort = '&sort=' +self.sort_col +',' +self.sort_dir;
			if(self.active_tags.length > 0){
				hash = '&tags='
				hash = hash.concat(self.active_tags.join('+'))
			}
			hash = hash.concat(sort);

			window.location.hash = hash;
		},

		generate_list:function(){
			var self = this;
			var container = d3.select('#project-list');
			var sorters = d3.selectAll('.sorter');
			var data = self.data;
			var item, link;
			var col_l,
					col_r;

			data = self.util_sortData(data);
			data = self.util_filterData(data);

			d3.select('.header').classed('null',false);

			//set up column sortability
			var class_str = 'focus ' +self.sort_dir;
			sorters
				.classed(class_str,function(){
					var elem_id = d3.select(this).attr('id'),
							elem_col = elem_id.split('_')[1];
					return elem_col === self.sort_col;
				})
				.on('click',function(){
					var elem = d3.select(this);
					var elem_id = elem.attr('id'),
							elem_col = elem_id.split('_')[1];
					if(elem_col !== self.sort_col){
						self.sort_dir = 'asc';
						self.sort_col = elem_col;
					} else{
						var old_dir = elem.classed('asc') ? 'asc' : 'desc',
								new_dir = old_dir === 'asc' ? 'desc' : 'asc';
						elem
							.classed(old_dir,false)
							.classed(new_dir,true);
						self.sort_dir = new_dir;
					}
					self.update_hash();
					self.generate_list();
				});

			//generate list of projects
			item = container.selectAll('li.project-row')
				.data(data);
			item.enter().append('li')
				.classed('project-row',true);
			item
				.attr('class','project-row')
				.html('');
			item.exit().remove();

			link = item.selectAll('a')
				.data(function(d){ return [d]; });
			link.enter().append('a');
			link
					.attr('href',function(d){ return d.url; })
					.attr('target',function(d){ return d.url_target; });
			link.exit().remove();

			col_l = link.selectAll('div.col_left')
				.data(function(d){ return [d]; });
			col_l.enter().append('div')
				.classed('col_left',true);
			col_l
					.html(function(d){ 
						var title = "<span class='project-title'>" +d.title +"</span>",
								ext = d.external === "true" ? "<span class='ext-arrow'>&nbsp;&#x2197;&#xFE0E;</span>" : "",
								role = d.role ? "<span class='project-role'>" +d.role +"</span>" : "",
								body = d.tagline;
						return "<div>" +title +ext +role +"</div>" +body; 
					});
			col_l.exit().remove();

			col_r = link.selectAll('div.col_right')
				.data(function(d){ return [d]; });
			col_r.enter().append('div')
				.classed('col_right',true);
			col_r
					.html(function(d){ 
						var html_c = "";
								html_y = "<span class='project-date'>" +d.year +"</span>";

						d.tags.forEach(function(_d,_i){
							html_c +="<div class='pix-tile' style='background:" +d.tags_meta[_i].c +";width:" +d.tags_meta[_i].w +"px;'></div>"
						});
						return html_y +"<div id='pix-tile-container'>" +html_c +"</div>";
					});
			col_r.exit().remove();

			if(data.length === 0){
				container.append('li')
					.classed('project-row',true)
					.classed('null',true)
					.html('No results.')
					.append('span')
						.attr('id','reset-project-filters')
						.html('Clear')
						.on('click',function(){
							self.reset_tagsAndTagDisplay();
						});
				d3.select('li.header').classed('null',true);
			}
		}
	}
}

projects().get_data();
