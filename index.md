---
layout: default
description: Emily Fuhrman.
---
<div id='chart'></div>
<link href='css/vis-index.css' rel='stylesheet' type='text/css' />

<script>
var JEKYLL_POSTS = [];
{% for post in site.posts %}
	JEKYLL_POSTS.push({
		num: 	 "{{ post.num }}",
		cat: 	 "{{ post.cat }}",
		title: 	 "{{ post.title }}",
		path: 	 "{{ post.path }}",
		tier_01: "{{ post.tier_01 }}",
		tier_02: "{{ post.tier_02 }}"
	});
{% endfor %}
</script>
<script src='js/vis_index.js' type='text/javascript'></script>

<div class='dekor index'></div>