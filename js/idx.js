var idx_schema = function(){

	return {
		tree:{},
		posts:[],
		posts_jek:POSTS_JEKYLL,
		posts_idx:POSTS_INDEX,
		tags_main:TAGS_MAIN,
		tags_subs:TAGS_SUBS,
		tags_show:[],
		generate:function(){
			var self = list;

			self.mashup();
			self.setLinks();
			self.buildSections();
			self.buildNav();
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
		buildSections:function(){
			var self = list,

				marginVal = 36,
				tags_all  = [],
				sections,
				sectionHeaders;

			//grab all post tags
			self.posts.forEach(function(d){
				if(d.tags.length >0){
					d.tags.forEach(function(_d){
						tags_all.push(_d);
					});	
				} else{
					tags_all.push('uncategorized');
				}
			});

			//determine which 'main' sections to build
			self.tags_main.forEach(function(d){
				if(tags_all.indexOf(d) >-1){
					self.tags_show.push(d);
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
			sectionHeaders = sections
				.selectAll('h4.headers')
				.data(function(d){return [d];});
			sectionHeaders.enter().append('h4')
				.classed('headers',true);
			sectionHeaders
				.html(function(d){
					var str = d.charAt(0).toUpperCase() + d.slice(1)
					return str;
				});
			sections.exit().remove();
			sectionHeaders.exit().remove();
		},
		buildNav:function(){
			
			//for now, ignore all other non-main tags
			//create 'personal' and 'client' dropdowns

			//PERSONAL: [toggle] anything without a client
			//CLIENT:   [toggle] anything with a client (pull list of clients)

						//also build dropdown of toggles
						//deactivated when CLIENT is untogged
						//activated when CLIENT is togged

		},
		filterList:function(param){
			var self = list,
				mos, 
				yrs,
				p = param || 'all';

			//hackily filter by date
			self.posts = self.posts.sort(function(a,b){
				var aDate = new Date( (parseInt(a.date.split(' ')[1])), (parseInt(a.date.split(' ')[0] -1)) ),
					bDate = new Date( (parseInt(b.date.split(' ')[1])), (parseInt(b.date.split(' ')[0] -1)) );
				return bDate -aDate;
			});

			//set up buckets for posts in each visible tag
			self.tags_show.forEach(function(d){
				if(!self.tree[d]){
					self.tree[d] = [];
				}
			});

			//sort posts into buckets
			self.posts.forEach(function(d){
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
				items,
				itemsLinks;

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

			d3.entries(self.tree).forEach(function(d){
				if(d.value.length >0){
					generateSection(d.value,d.key);
				}
			});
		}
	}
}

var list = idx_schema();
list.generate();