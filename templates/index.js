'use strict';

var config = {
	modules: {
<%= modules %>
	},
	development: true
};

require('tesselate')(config, function(tessel, m) {

	console.log('TESSEL READY!!');

	setInterval(function() {
		tessel.led[0].toggle();
	}, 300);

});
