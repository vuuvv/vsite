define([], function() {

var views = {
	tree: ["list"]
};

var lookup_dict = {
	"pages.url": "tree"
};

config = {
	get_template: function(app_label, module_name, view, part) {
		return 'text!templates/model/' + this.get_view_type(app_label, module_name, view) + '/' + view + "/" + part + ".html";
	},

	get_view: function(app_label, module_name, view) {
		return 'views/' + this.get_view_type(app_label, module_name, view) + '/' + view
	},

	get_view_type: function(app_label, module_name, view) {
		var type = "common", 
			cls = app_label + "." + module_name;

		if (cls in lookup_dict)
			type = lookup_dict[cls]

		if (!(type in views && _.indexOf(views[type], view) != -1))
			type = "common";
		return type;
	}
}

return config;

});
