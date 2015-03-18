var idx_schema = function(){

	return {
		tree:{},
		posts:[],
		posts_show:[],
		posts_jek:POSTS_JEKYLL,
		posts_idx:POSTS_INDEX,
		tags_main:TAGS_MAIN,
		tags_subs:TAGS_SUBS,
		tags_show:[],
		selectors_show:[],
		generate:function(){
			var self = list;

			self.mashup();
			self.setLinks();
			self.buildNav();
			self.filterList();
			self.generateList();
		},
		refreshList:function(){
			var self = list;

			self.filterList();
			self.generateList();
		},
		mashup:function(){
			var self = list;

			self.posts_jek.forEach(function(d,i){
				var obj = {};

				obj.date = d.date;
				obj.title = d.title;
				obj.cat = d.cat;
				obj.cred = d.cred || '';
				obj.thru = d.thru || '';
				obj.path = d.path;
				obj.tags = d.tags;
				self.posts.push(obj);
			});
			self.posts_idx.forEach(function(d,i){
				var obj = {};

				obj.date = d.date;
				obj.title = d.title;
				obj.cat = d.cat;
				obj.client = d.client;
				obj.cred = d.cred || '';
				obj.thru = d.thru || '';
				obj.path = d.path;
				obj.tags = d.tags;
				self.posts.push(obj);
			});
		},
		setLinks:function(){
			var self = list;

			self.posts.forEach(function(d,i){
				var href;
				if(d.cat === 'projects'){
					href = '/' +d.cat +'/' +d.path +'.html';
				} else if(d.cat === 'x'){
					href = '/' +d.cat +'/' +d.path;
				} else{
					href = d.path;
				}
				d.href = href;
			});
		},
		buildNav:function(){

			//TODO:
			//CLIENT:   //build dropdown of toggles (pull list of clients)
						//deactivated when CLIENT is untogged
						//activated when CLIENT is togged
			
			var self = list,

				selector_tags = [],
				selector_tags_clients = [],
				selector,
				selector_tog,
				selector_label;

			//determine which selectors to have
			self.posts.forEach(function(d,i){
				var label;
				if(d.client){
					label = 'client';
					if(selector_tags_clients.indexOf(d.client) <0){
						selector_tags_clients.push(d.client);
					}
				} else{
					label = 'personal';
				}
				if(selector_tags.indexOf(label) <0){
					selector_tags.push(label);
				}
			});

			//make sure that if only one dropdown is built, it's the 'client' one
			if(selector_tags.length >0 && !(selector_tags.length === 1 && selector_tags[0] === 'personal')){
				selector = d3.select('#index-nav')
					.selectAll('div.selector')
					.data(selector_tags);
				selector.enter().append('div')
					.classed('selector',true);

				selector_tog = selector
					.selectAll('div.selector_tog')
					.data(function(d){return [d];});
				selector_tog.enter().append('div')
					.classed('selector_tog',true);
				selector_tog
					.attr('class',function(d,i){
						return d +' selector_tog selected';
					});
				selector_tog
					.on('click',function(d,i){
						var tog = d3.select(this),
							selected = tog.classed('selected');
						tog.classed('selected',!selected);

						self.refreshList();
					});

				selector_label = selector
					.selectAll('h4.selector_label')
					.data(function(d){return [d];});
				selector_label.enter().append('h4')
					.classed('selector_label',true);
				selector_label
					.html(function(d){
						var str = d.charAt(0).toUpperCase() + d.slice(1);
						return str;
					});

				selector.exit().remove();
				selector_tog.exit().remove();
				selector_label.exit().remove();
			}
		},
		filterList:function(){

			//filters data and sets up holders for each section
			var self = list,

				//check to make sure these filters exist, are selected
				clie_on = d3.selectAll('.client.selector_tog')[0].length >0 ? d3.select('.client.selector_tog').classed('selected') : false,
				pers_on = d3.selectAll('.personal.selector_tog')[0].length >0 ? d3.select('.personal.selector_tog').classed('selected') : false,

				marginVal = 36,
				tags_all  = [],
				sections,
				section_headers;

			//clean
			self.posts_show = [];
			self.tags_show  = [];
			self.tree       = {};

			//determine which posts to show
			if(pers_on){
				self.posts.forEach(function(d){
					if(d.cat && d.cat === 'projects' || d.cat && d.cat === 'x'){ self.posts_show.push(d); }
				});
			}
			if(clie_on){
				self.posts.forEach(function(d){
					if(d.client){ self.posts_show.push(d); }
				});
			}

			//hackily filter visible posts by date
			self.posts_show = self.posts_show.sort(function(a,b){
				var aDate = new Date( (parseInt(a.date.split(' ')[1])), (parseInt(a.date.split(' ')[0] -1)) ),
					bDate = new Date( (parseInt(b.date.split(' ')[1])), (parseInt(b.date.split(' ')[0] -1)) );
				return bDate -aDate;
			});

			//grab all post tags
			self.posts_show.forEach(function(d){
				if(d.tags.length >0){
					d.tags.forEach(function(_d){
						tags_all.push(_d);
					});	
				} else{
					tags_all.push('uncategorized');
				}
			});

			//determine which 'main' sections to build (as specified in tags.yml)
			self.tags_main.forEach(function(d){
				if(tags_all.indexOf(d) >-1){
					self.tags_show.push(d);
				}
			});

			//set up buckets for posts in each visible tag
			self.tags_show.forEach(function(d){
				if(!self.tree[d]){
					self.tree[d] = [];
				}
			});

			//sort posts into buckets
			self.posts_show.forEach(function(d){
				d.tags.forEach(function(_d){
					if(self.tags_show.indexOf(_d) >-1){
						d.tagged = _d;
					}
				});
				if(d.tagged){
					self.tree[d.tagged].push(d);
				} else{
					self.tree['uncategorized'].push(d);
				}
			});

			//build sections
			sections = d3.select('#index-list')
				.selectAll('div.section')
				.data(self.tags_show);
			sections.enter().append('div')
				.classed('section',true);
			sections
				.attr('class',function(d){
					return d +' section';
				})
				.style('width',function(){
					return window.innerWidth -(marginVal*2) +'px';
				})
				.style('padding-bottom',function(d,i){
					var pad = i +1 === self.tags_show.length ? marginVal : 0;
					return pad +'px';
				});

			//add section headers
			section_headers = sections
				.selectAll('h4.headers')
				.data(function(d){return [d];});
			section_headers.enter().append('h4')
				.classed('headers',true);
			section_headers
				.html(function(d){
					var str = d.charAt(0).toUpperCase() + d.slice(1);
					return str;
				});
			sections.exit().remove();
			section_headers.exit().remove();
		},
		generateList:function(){
			var self = list,
				items,
				itemsLinks;

			//TODO: filter transition

			//renders each list in its designated section
			function generateSection(data,handle){
				var selector = '#index-list .section.' +handle;
				items = d3.select(selector)
					.selectAll('a.item')
					.data(data);
				items.enter().append('a')
					.classed('item',true);
				items
					.attr('href',function(d){
						return d.href;
					})
					.attr('target','_blank')
					.html(function(d,i){
						var str,
							cli = d.client ? '<span class="client">' +d.client +'</span>,&nbsp;' : '<span class="client"></span>',
							title = d.title ? '"' +d.title +'"' : '',
							thruspan = d.thru ? '<span class="thru">&nbsp;/&nbsp;' +d.thru +'</span>' : '';
							credspan = d.cred ? '<span class="cred">&nbsp;/&nbsp;w.&nbsp;' +d.cred +'</span>' : '',
						str = d.date +cli +title +thruspan +credspan;
						return str;
					});
				items.exit().remove();
			}

			if(d3.entries(self.tree).length === 0){
				d3.select('#index-list')
					.append('h4')
					.attr('class','no-posts')
					.html('No items to display.');
			} else{
				d3.entries(self.tree).forEach(function(d){
					d3.selectAll('h4.no-posts').remove();
					if(d.value.length >0){
						generateSection(d.value,d.key);
					}
				});
			}
		}
	}
}

var list = idx_schema();
list.generate();