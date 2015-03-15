var idx_schema = function(){

	return {
		posts:[],
		posts_jek:JEKYLL_POSTS,
		posts_idx:INDEX_POSTS,
		generate:function(){
			var self = list;

			self.mashup();
			self.setLinks();
			self.filterList();
			self.generateList();
		},
		mashup:function(){
			var self = list;

			self.posts_jek.forEach(function(d,i){
				var obj = {};
				obj.date = d.date;
				obj.title = d.title;
				obj.path = d.path;
				obj.cat = d.cat;
				self.posts.push(obj);
			});
			self.posts_idx.forEach(function(d,i){
				var obj = {};
				obj.date = d.date;
				obj.title = d.title;
				obj.path = d.path;
				obj.cat = d.cat;
				obj.client = d.client;
				obj.cred = d.cred || '';
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
		filterList:function(param){
			
			//possible filter params: all, personal, client

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
		},
		generateList:function(){
			var self = list,
				items,
				itemsLinks;
				
			items = d3.select('#index-list')
				.selectAll('a.item')
				.data(self.posts);
			items.enter().append('a')
				.classed('item',true);
			items
				.attr('href',function(d){
					return d.href;
				})
				.html(function(d,i){
					var str,
						cli = d.client ? d.client +',&nbsp;' : '',
						title = d.title ? '"' +d.title +'"&nbsp;' : '',
						credspan = d.cred ? '&nbsp;/&nbsp;<span class="cred">' +d.cred +'</span>' : '';
					str = d.date +'&nbsp;/&nbsp;' +cli +title +credspan;
					return str;
				});
			items.exit().remove();
		}
	}
}

var list = idx_schema();
list.generate();