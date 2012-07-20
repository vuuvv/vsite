define([], function() {

var views = {
	tree: ["list"]
};

var lookup_dict = {
	"pages.url": "tree"
};

var file_types = {
	photo: ["ico","png", "bmp", "gif", "jpg", "jpeg"],
	music: ["mp3", "wav"],
	video: ["mp4", "flv"],
	zip: ["zip", "7z", "rar", "gz", "tgz", "bz", "tar"],
	custom: ["doc", "exe", "html", "ppt", "pdf", "txt", "wps", "xls"]
};

window.config = {
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
	},

	get_file_type: function(name) {
		var parts = name.split("."),
			index = parts.length - 1;

		if (index <= 0) 
			return "other";
		var ext = parts[index];

		for (type in file_types) {
			var exts = file_types[type];
			if (_.indexOf(exts, ext) >= 0) {
				if(type === "custom") {
					return ext;
				} else {
					return type;
				}
			}
		}
		return "other";
	},

	format_size: function(s,type) {  
		if (/[^0-9\.]/.test(s)) return "0";  
		if (s == null || s == "") return "0";  
		s = s.toString().replace(/^(\d*)$/, "$1.");  
		s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");  
		s = s.replace(".", ",");  
		var re = /(\d)(\d{3},)/;  
		while (re.test(s))  
		s = s.replace(re, "$1,$2");  
		s = s.replace(/,(\d\d)$/, ".$1");  
		if (type == 0) {// 不带小数位(默认是有小数位)  
			var a = s.split(".");  
			if (a[1] == "00") {  
				s = a[0];  
			}  
		}  
		return s;  
	},

	format_file_size: function(size) {
		if (size < 1024) {
			return size + "B";
		}
		return config.format_size(size / 1024) + "KB";
	}
}

return config;

});
