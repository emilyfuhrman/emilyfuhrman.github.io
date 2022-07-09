var projects = function(){

	return {

		data:[],
		data_tags:[],

		active_tags:[],

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

			_data.forEach(function(d){
				d.tags.forEach(function(_d){
					if(self.data_tags.indexOf(_d) <0){ self.data_tags.push(_d); }
				});
			});
			self.data_tags.sort();

			self.generate_tags();
			self.generate_list();
		},

		generate_tags:function(){
			var self = this;
			var tags;

			tags = d3.select('#projects .masthead #project-tags').selectAll('div.project-tag')
				.data(self.data_tags);
			tags.enter().append('div')
				.classed('project-tag',true);
			tags
				.text(function(d){ 
					var label = 
						d === 'cartography' ? 'cartographies'
					: d === 'client' ? 'client work'
					: d === 'collaboration' ? 'collaborations'
					: d === 'commission' ? 'commissions'
					: d === 'compendium' ? 'compendiums'
					: d === 'dh' ? 'digital humanities'
					: d === 'notation' ? 'graphic notation'
					: d; 
					return label;
				});
			tags
				.on('click',function(d){
					if(self.active_tags.indexOf(d) <0){
						self.active_tags.push(d);
					} else{
						self.active_tags = self.active_tags.filter(function(_d){ return _d !== d; });
					}
					self.update_tags(tags);
					self.generate_list();
				});
			tags.exit().remove();
		},

		update_tags:function(_handle){
			var self = this;
			var tags = _handle || d3.selectAll('div.project-tag');
			tags.classed('active',function(d){
				return self.active_tags.indexOf(d) >-1;
			});
		},

		reset_tags:function(){
			var self = this;
			self.active_tags = [];
			self.update_tags();
			self.generate_list();
		},

		generate_list:function(){
			var self = this;
			var container = d3.select('#project-list');
			var data, item, link;
			var col_l,
					col_r;

			data = self.util_filterData(self.data);

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
					.html(function(d){ return "<span class='project-date'>" +d.year +"</span>" });
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
							self.reset_tags();
						});
			}
		}
	}
}

projects().get_data();
