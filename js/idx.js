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
				obj.descrip = d.descrip;
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
				.selectAll('div.item')
				.data(self.posts);
			items.enter().append('div')
				.classed('item',true);
			items.exit().remove();

			itemsLinks = items
				.selectAll('a')
				.data(function(d){return [d];});
			itemsLinks.enter().append('a');
			itemsLinks
				.attr('href',function(d){
					return d.href;
				})
				.html(function(d,i){
					var str,
						cli = d.client ? d.client +',&nbsp;' : '',
						des = d.descrip ? d.descrip +',&nbsp;' : '',
						credspan = d.cred ? '<span class="cred">&nbsp;/&nbsp;' +d.cred +'</span>' : '';
					str = '<h4>&rarr;&nbsp;' +d.date +'&nbsp;/&nbsp;' +cli +des +d.title +credspan +'</h4>';
					return str;
				});
			itemsLinks.exit().remove();
		}
	}
}

var list = idx_schema();
list.generate();