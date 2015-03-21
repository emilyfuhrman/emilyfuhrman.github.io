var idx_schema = function(){

	//this looks best when filtering doesn't add/remove entire sections
	//template is still built to handle it as smoothly as possible, tho

	return {
		init:true,
		tree:{},
		posts:[],
		posts_show:[],
		posts_jek:POSTS_JEKYLL,
		posts_idx:POSTS_INDEX,
		tags_main:TAGS_MAIN,
		tags_show:[],
		selectors_show:[],
		marginVal:36,
		transitionTime:120,
		delayTimeEnter:510,
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
		refreshList:function(){
			var self = list;

			self.filterList();
			self.generateList();
		},
		mashup:function(){
			var self = list,
				counter = 0;

			//assign unique keys to posts to enable object constancy
			function generateKey(d){
				var str = d.title.split(' ').join('_').toLowerCase();

				//remove all punctuation
				str = str.replace(/[^\w\s]|/g, "").replace(/\s+/g, " ");
				str = '_' +counter +'_' +str;

				counter++;
				return str;
			}

			self.posts_jek.forEach(function(d,i){
				var obj = {};

				obj.date = d.date;
				obj.title = d.title;
				obj.cat = d.cat;
				obj.cred = d.cred || '';
				obj.thru = d.thru || '';
				obj.path = d.path;
				obj.tags = d.tags;

				obj.key = generateKey(d);

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

				obj.key = generateKey(d);

				self.posts.push(obj);
			});

			self.posts.forEach(function(d,i){
				if(d.cat === 'projects' || d.cat === 'x'){
					d.personal = true;
				}
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
			var self = list;

			//clean
			self.selectors_show = [];

			//determine which selectors to have
			self.posts.forEach(function(d,i){
				var obj = {}, 
					sup,
					lbl;

				if(d.client){
					lbl = 'client';
					sup = true;
				} else{
					lbl = 'personal';
					sup = false;
				}

				obj.name  = lbl;
				obj.super = sup;
				obj.selected = true;

				if(self.selectors_show.filter(function(_d){ return obj.name === _d.name; }).length === 0){
					self.selectors_show.push(obj);
				}
			});

			//for super-selectors, create full list of sub-items
			self.selectors_show.filter(function(d){ return d.super; }).forEach(function(_d){
				var lbl = _d.name,
					str = 'list_' +lbl;
				if(!self[str]){
					self[str] = [];
				}
				self.posts.forEach(function(p){
					if(p[lbl] && self[str].filter(function(_p){ return _p.name === p[lbl]; }).length === 0){
						var obj = {};
						obj.name = p[lbl];
						self[str].push(obj);
					}
				});
				self[str] = self.op_alphabetize(self[str],'name');
				return self[str];
			});

			//resize navigation panel
			var index_nav = d3.select('#index-nav')
				.style('width',function(){
					return window.innerWidth -(self.marginVal*2) +'px';
				});

			//make sure that if only one dropdown is built, it's the 'client' one
			if(self.selectors_show.length >0 && !(self.selectors_show.length === 1 && self.selectors_show[0].name === 'personal')){
				
				var selector,
					selector_tog,
					selector_label,

					//super-selector variables
					selector_dd,
					selector_dd_items,
					selector_dd_items_labels;

				//all selectors
				selector = index_nav
					.selectAll('div.selector')
					.data(self.selectors_show);
				selector.enter().append('div')
					.classed('selector',true);
				selector
					.attr('class',function(d,i){
						var str = d.name === 'client' ? d.name +' super' : d.name;
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
						return d.name +' selector_tog selected';
					});
				selector_tog
					.on('click',function(d,i){
						var tog = d3.select(this),
							ref = d.name,
							str = 'list_' +ref,
							selected = tog.classed('selected');

						//[parent] mark in data
						self.selectors_show.forEach(function(_d){
							if(_d.name === d.name){
								d.selected = !selected;
							}
						});

						//[children] mark in data
						if(self[str]){
							self[str].forEach(function(_d){
								_d.unselected = selected;
							});
						}

						//UI change
						tog.classed('selected',!selected);

						//UI change [children]
						d3.selectAll('.selector.' +ref +' .label').classed('unselected',selected);

						self.refreshList();
					});

				selector_label = selector
					.selectAll('h4.selector_label')
					.data(function(d){return [d];});
				selector_label.enter().append('h4')
					.classed('selector_label',true);
				selector_label
					.html(function(d){
						var str = d.name.charAt(0).toUpperCase() + d.name.slice(1);
						str = d3.select(this.parentNode).classed('super') ? str + '<span class="arr">&#8690;</span>' : str;
						return str;
					});
				selector.exit().remove();
				selector_tog.exit().remove();
				selector_label.exit().remove();

				//dropdowns for super-selectors
				selector_dd = selector
					.selectAll('div.selector_dd')
					.data(function(d){ 
						return d3.select(this.parentNode).classed('super') ? [d] : false; 
					});
				selector_dd.enter().append('div')
					.classed('selector_dd',true);

				selector_dd_items = selector_dd
					.selectAll('li.selector_dd_item')
					.data(function(d){
						var ref = d3.select(this.parentNode).data()[0].name,
							str = 'list_' +ref;
						return self[str];
					});
				selector_dd_items.enter().append('li')
					.classed('selector_dd_item',true);
				selector_dd_items
					.on('click',function(d){
						var li  = d3.select(this.childNodes[0]),
							ref = d3.select(this.parentNode).data()[0].name,
							str = 'list_' +ref,
							selected,
							unselected = li.classed('unselected');

						//[child] mark in data
						self[str].forEach(function(_d){
							if(_d.name === d.name){
								d.unselected = !unselected;
							}
						});

						//[parent] mark in data
						//to do so, check if all list items are unselected
						if(self[str].filter(function(_d){ return _d.unselected; }).length <self[str].length){
							selected = true;
						} else{
							selected = false;
						}
						self.selectors_show.forEach(function(_d){
							if(_d.name === ref){ _d.selected = selected; }
						});

						//UI change
						li.classed('unselected',!unselected);

						//UI change [parent]
						d3.select('.selector.' +ref +' .selector_tog').classed('selected',selected);

						self.refreshList();
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
				selector_dd.exit().remove();
				selector_dd_items.exit().remove();
				selector_dd_items_labels.exit().remove();
			}
		},
		filterList:function(){

			//filters data and sets up holders for each section
			var self = list,
				tags_all = [];

			//clean
			self.posts_show = [];
			self.tags_show  = [];
			self.tree       = {};

			//filter data
			self.selectors_show.forEach(function(d,i){
				var lbl = d.name,
					str = 'list_' +lbl;
				if(d.selected && !d.super){
					self.posts.forEach(function(_d){
						if(_d[lbl]){ self.posts_show.push(_d); }
					});
				} else if(d.selected && d.super){
					self.posts.forEach(function(_d){
						if(_d[lbl]){
							self[str].forEach(function(p){
								if(_d[lbl] === p.name && !p.unselected){ self.posts_show.push(_d); }
							});
						}
					});
				}
			});

			//alphabetize visible posts
			self.posts_show = self.op_alphabetize(self.posts_show,'title');

			//hackily filter visible posts by date
			self.posts_show = self.posts_show.sort(function(a,b){
				var aDate = new Date( (parseInt(a.date.split(' ')[1])), (parseInt(a.date.split(' ')[0] -1)) ),
					bDate = new Date( (parseInt(b.date.split(' ')[1])), (parseInt(b.date.split(' ')[0] -1)) );
				return bDate -aDate;
			});

			//grab all post tags (from full list, not just show list)
			self.posts.forEach(function(d){
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
		},
		generateList:function(){
			var self = list,

				sections,
				section_headers,

				items;

			//transition variables
			var del_hgts = self.delayTimeEnter,

				del_fade_wait = del_hgts*0.75,
				del_clss_wait = del_fade_wait +self.delayTimeEnter,

				del_init = self.transitionTime,
				del_half = self.transitionTime*4
				del_last = self.transitionTime*6,

				//rando space of time it takes to start items-out transition
				del_d3   = self.transitionTime*2.475,

				dur_dent = self.transitionTime,
				dur_fade = self.transitionTime,
				dur_hgts = self.init ? 0 : self.transitionTime
				;

			//build sections (all possible)
			sections = d3.select('#index-list')
				.selectAll('div.section')
				.data(self.tags_main,function(d){ return d; });
			sections.enter().append('div')
				.classed('section',true)
				.style('height',function(d){
					var val = self.tree[d] ? (self.tree[d].length)*36 +54 : 0;
					return val +'px';
				});
			sections
				.order()
				.style('width',function(){
					return window.innerWidth -(self.marginVal*2) +'px';
				})
				.transition()
				.delay(function(d){
					var newH = self.tree[d] ? (self.tree[d].length)*36 +54 : 0,
						curH = d3.select(this)[0][0].clientHeight,
						shorter = newH <curH;
					return shorter ? del_hgts : 0;
				})
				.duration(dur_hgts)
				.styleTween('height',function(d,i){
					var newval = self.tree[d] ? (self.tree[d].length)*36 +54 : 0,
						padbot = 12,
						s1 = d3.select(this)[0][0].clientHeight -padbot +'px', 
						s2 = newval +'px';
					return d3.interpolate(s1,s2);
				})
				.transition()
				.duration(0)
				.style('padding-bottom',function(d,i){
					var pad = i +1 === self.tags_main.length ? self.marginVal : self.tree[d] ? 12 : 0;
					return pad +'px';
				})
				.transition()
				.delay(function(d){
					var deact = self.tree[d] && self.tree[d].length === 0;
					return deact ? del_d3 : del_clss_wait;
				})
				.duration(0)
				.attr('class',function(d){
					var deact = self.tree[d] && self.tree[d].length === 0 ? ' deact' : '';
					return d +' section' +deact;
				});
			sections.exit().remove();

			//add section headers (only those with data)
			section_headers = sections
				.selectAll('h4.headers')
				.data(function(d){ return self.tree[d] ? [d] : false; },function(d){ return d; });
			section_headers.enter().append('h4')
				.classed('headers',true);
			section_headers
				.html(function(d){
					var str = d.charAt(0).toUpperCase() + d.slice(1);
					return str;
				});
			section_headers.exit().remove();

			items = sections
				.selectAll('a.item')
				.data(function(d){ return self.tree[[d]] ? self.tree[[d]] : false; },function(d){ return d.key; });
			items.enter().append('a')
				.classed('item',true)
				.style('opacity',0)
				.style('top',function(d,i){
					return i*36 +'px';
				})
				.style('left',function(d){
					return self.init ? '0px' : '9px';
				});
			items
				.order()
				.attr('id',function(d,i){
					return d.key;
				})
				.attr('class',function(d){
					var clss = 'item ' +d.tagged;
					self.selectors_show.forEach(function(_d,i){
						var lbl = _d.name,
							str = 'list_' +lbl;
						if(_d.super && d[lbl]){
							clss = clss +' ' +d[lbl].split(' ').join('_');
						}
					});
					clss = clss.toLowerCase();
					return clss;
				})
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
					str = '<div>' +d.date +cli +title +thruspan +credspan +'</div>';
					return str;
				})
				.transition()
				.delay(function(d,i){
					//if new list is shorter, delay
					//if new list is longer, no delay
					var tagD = d.tagged || 'uncategorized',
						newL = self.tree[tagD].length,
						curL = d3.selectAll('a.item.' +tagD)[0].length,
						shorter = newL <curL;
					return shorter ? del_hgts : 0;
				})
				.duration(dur_hgts)
				.styleTween('top',function(d,i){
					var s1 = d3.select(this).style('top'),
						s2 = i*36 +'px';
					return d3.interpolate(s1,s2);
				})
				.transition()
				.delay(function(){
					return self.init ? 0 : del_fade_wait;
				})
				.duration(function(){
					return self.init ? 0 : dur_fade;
				})
				.style('opacity',1)
				.transition()
				.delay(del_last)
				.duration(function(){
					return self.init ? 0 : dur_dent;
				})
				.styleTween('left',function(){
					var s1 = '9px',
						s2 = '0px';
					return d3.interpolate(s1,s2);
				});
			items.exit()
				.transition()
				.delay(del_init)
				.duration(dur_dent)
				.styleTween('left',function(){
					var s1 = '0px',
						s2 = '9px';
					return d3.interpolate(s1,s2);
				})
				.transition()
				.delay(del_half)
				.duration(dur_fade)
				.style('opacity',0)
				.transition()
				.delay(del_last)
				.remove();

			//flag for initial load
			self.init = false;
		}
	}
}

var list = idx_schema();
list.generate();