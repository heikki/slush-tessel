'use strict';

var config = {
	modules: {<% modules.forEach(function(module, index, arr) { %>
	  <%= module.port %>: <% if (module.name) { %>['<%= module.name %>', '<%= module.abbr %>']<% } else { %>null<% } %><% if (index < arr.length - 1) { %>,<% } %><% }) %>
	},
	development: true
};

require('tesselate')(config, function(tessel, m) {

	console.log('TESSEL READY!!');

	setInterval(function() {
		tessel.led[0].toggle();
	}, 300);

});
