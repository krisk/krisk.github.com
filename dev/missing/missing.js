(function () {
	function load() {
		var placeholder,
			iframe,
			i, len,
			placeholders = document.getElementsByClassName('missing');
		
		for (i=0, len = placeholders.length; i<len; i++) {
			placeholder = placeholders[i];
			iframe = document.createElement('iframe');
			iframe.src = "missing.html";
			placeholder.appendChild(iframe);
		}
	}
	
	if ( document.addEventListener ) {  // FF, Opera, etc..
        window.addEventListener('load', load, false);
    } else if (document.attachEvent) { // IE
        window.attachEvent('onload', load);
    }
})();