(function() {
	var views = ['year', 'gesture', 'format'];
	var defaultView = 'year';

	function getActiveView() {
		var hash = window.location.hash.replace('#', '');
		var match = hash.match(/(?:^|&)view=([^&]+)/);
		if (match && views.indexOf(match[1]) > -1) { return match[1]; }
		return defaultView;
	}

	function setView(v) {
		views.forEach(function(view) {
			document.getElementById('view-' + view).style.display = (view === v) ? '' : 'none';
		});
		document.querySelectorAll('#project-view-nav .view-option').forEach(function(el) {
			el.classList.toggle('active', el.dataset.view === v);
		});
		window.location.hash = 'view=' + v;
	}

	document.querySelectorAll('#project-view-nav .view-option').forEach(function(el) {
		el.addEventListener('click', function() { setView(el.dataset.view); });
	});

	setView(getActiveView());
}());
