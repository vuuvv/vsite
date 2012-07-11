define([], function() {

var config = {
	templates: []
};

config.get_template = function(name) {
	if (_.indexOf(config.templates, name) == -1)
		name = "common";
	return 'text!templates/model/' + name + '/';
};

return config;

});
