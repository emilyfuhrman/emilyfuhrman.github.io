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
		client_list:[],
		op_alphabetize:function(data,param){
			data = data.sort(function(a,b){
				var varA = param ? a[param] : a,
					varB = param ? b[param] : b;

				if(varA <varB){
					return -1;
				} else if(varA >varB){
					return 1;
				} else{
					return 0;
				}
			});
			return data;
		},
		generate:function(){
			var self = list;

			self.mashup();
			self.setLinks();
			self.buildNav();
			self.filterList();
			self.generateList();
		},
		refreshList:function(item){
			var self = list;

			self.filterList(item);
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

			var self = list,

				marginVal = 36,
				selector_tags = [],
				selector_tags_clients = [],
				selector,
				selector_tog,
				selector_label,
				selector_dd,
				selector_dd_items,
				selector_dd_items_labels;

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

			//create full list of clients
			self.posts.forEach(function(d,i){
				if(d.client && self.client_list.filter(function(_d){ return _d.name === d.client; }).length === 0){
					var obj = {};
					obj.name = d.client;
					self.client_list.push(obj);
				}
			});

			//alphabetize client list
			self.client_list = self.op_alphabetize(self.client_list,'name');

			var index_nav = d3.select('#index-nav')
				.style('width',function(){
					return window.innerWidth -(marginVal*2) +'px';
				});

			//make sure that if only one dropdown is built, it's the 'client' one
			if(selector_tags.length >0 && !(selector_tags.length === 1 && selector_tags[0] === 'personal')){
				selector = index_nav
					.selectAll('div.selector')
					.data(selector_tags);
				selector.enter().append('div')
					.classed('selector',true);
				selector
					.attr('class',function(d,i){
						var str = d === 'client' ? d +' super' : d;
						return 'selector ' +str;
					})
					.on('mouseover',function(d){
						var selector = d3.select(this);
						if(selector.classed('super')){
							selector
								.classed('open',true)
								.classed('closed',false);
						}
					})
					.on('mousemove',function(d){
						return;
					})
					.on('mouseout',function(d){
						var selector = d3.select(this);
						if(selector.classed('super')){
							selector
								.classed('closed',true)
								.classed('open',false);
						}
					});

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

						self.refreshList(this);
					});

				selector_label = selector
					.selectAll('h4.selector_label')
					.data(function(d){return [d];});
				selector_label.enter().append('h4')
					.classed('selector_label',true);
				selector_label
					.html(function(d){
						var str = d.charAt(0).toUpperCase() + d.slice(1);
						str = d3.select(this.parentNode).classed('super') ? str + '<span class="arr">&#8690;</span>' : str;
						return str;
					});

				selector_dd = selector
					.selectAll('div.selector_dd')
					.data(function(d){ 
						return d3.select(this.parentNode).classed('super') ? [d] : false; 
					});
				selector_dd.enter().append('div')
					.classed('selector_dd',true);

				selector_dd_items = selector_dd
					.selectAll('li.selector_dd_item')
					.data(self.client_list);
				selector_dd_items.enter().append('li')
					.classed('selector_dd_item',true);
				selector_dd_items
					.on('click',function(d){
						var li = d3.select(this.childNodes[0]),
							unselected = li.classed('unselected');
						li.classed('unselected',!unselected);

						self.client_list.forEach(function(_d){
							if(_d === d){
								d.unselected = !unselected;
							}
						});

						self.refreshList(this);
					});

				selector_dd_items_labels = selector_dd_items
					.selectAll('span.label')
					.data(function(d){return [d];});
				selector_dd_items_labels.enter().append('span')
					.classed('label',true);
				selector_dd_items_labels
					.html(function(d){
						return d.name;
					});

				selector.exit().remove();
				selector_tog.exit().remove();
				selector_label.exit().remove();
				selector_dd.exit().remove();
				selector_dd_items.exit().remove();
				selector_dd_items_labels.exit().remove();
			}
		},
		filterList:function(item){

			//TODO: programmatically cycle through filters
			//TODO: make this more data-driven: use array of selectors as objects

			//filters data and sets up holders for each section
			var self = list,
				marginVal = 36,
				tags_all  = [],
				sections,
				section_headers;

			//check to make sure these filters exist, are selected
			var pers_on = d3.selectAll('.personal.selector_tog')[0].length >0 ? d3.select('.personal.selector_tog').classed('selected') : false,
				clie_on = d3.selectAll('.client.selector_tog')[0].length >0 ? d3.select('.client.selector_tog').classed('selected') : false;

			//clean
			self.posts_show = [];
			self.tags_show  = [];
			self.tree       = {};

			function tog_control(){

				//personal filter
				if(pers_on){
					self.posts.forEach(function(d){
						if(d.cat && d.cat === 'projects' || d.cat && d.cat === 'x'){ self.posts_show.push(d); }
					});
				}

				//client filter
				if(clie_on){
					//pushes all client posts into posts_show array
					self.client_list.forEach(function(d){
						d.unselected = false;
					});
					d3.selectAll('.client.selector .label').classed('unselected',false);
					self.posts.forEach(function(d){
						if(d.client){ self.posts_show.push(d); }
					});
				} else{
					//doesn't push any client posts into posts_show array
					self.client_list.forEach(function(d){
						d.unselected = true;
					});
					d3.selectAll('.client.selector .label').classed('unselected',true);
				}
			}

			function line_control(){

				//personal filter
				if(pers_on){
					self.posts.forEach(function(d){
						if(d.cat && d.cat === 'projects' || d.cat && d.cat === 'x'){ self.posts_show.push(d); }
					});
				}

				//pushes only available clients into list
				var showClients = self.client_list.filter(function(d){ return !d.unselected; });
				self.posts.forEach(function(d){
					showClients.forEach(function(_d){
						if(d.client && d.client === _d.name){ self.posts_show.push(d); }
					});
				});

				if(showClients.length >0){
					d3.select('.client.selector .selector_tog').classed('selected',true);
				} else{
					d3.select('.client.selector .selector_tog').classed('selected',false);
				}
			}

			if(item && d3.select(item).classed('selector_tog')){
				tog_control();
			} else if(item && d3.select(item).classed('selector_dd_item')){
				line_control();
			} else{
				tog_control();
			}

			//alphabetize visible posts
			self.posts_show = self.op_alphabetize(self.posts_show,'title');

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
				.style('margin-left',0)
				.style('padding-bottom',function(d,i){
					var pad = i +1 === self.tags_show.length ? marginVal : 12;
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

			//TODO: filter transition? (not super clean b/c these are done in sections..)

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