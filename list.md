---
layout: default
title:	"| PROJECTS"
description: Emily Fuhrman.
---
<div id='proj-list'>
	{% for post in site.posts %}
	<a href='{{ post.category }}/{{ post.path }}.html'>
		<img class='list-img' src='images/thumbs/proj-{{ post.num }}_thumb.png'>
		<div>
			<p class='list-title'>{{ post.title }}</p>
			<p class='list-date'>{{ post.date | date: "%m.%Y" }}</p>
		</div>
	</a>
	{% endfor %}
</div>
<div class='dekor proj'></div>