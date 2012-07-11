define([], function() {

var templates = {
	tree: ["list"]
};

var lookup_dict = {
	"pages.URL": "tree"
};

config = {
	get_template: function(model, name, part) {
		var type = "common", 
			cls = model.app_label + "." + model.model_name;

		if (cls in lookup_dict)
			type = lookup_dict[cls]

		if (!(type in templates && _.indexOf(templates[type], name) != -1))
			type = "common";
		return 'text!templates/model/' + type + '/' + name + "/" + part + ".html";
	}
}

return config;

});
