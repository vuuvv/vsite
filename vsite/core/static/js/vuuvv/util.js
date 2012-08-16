define(function(require, exports, module) {

if (!window.console) {
	window.console = {};
}
if (!console.log) {
	console.log = function() {};
}

String.format = function(str) {
	var args = arguments,
		re = new RegExp("%([1-" + args.length + "])", "g");
	return String(str).replace(re, function($1, $2) {
		return args[$2];
	});
};

String.formatmodel = function(str, model) {
	for (var k in model) {
		var re = RegExp("{" + k + "}", "g");
		str = str.replace(re, model[k])
	}
	return str;
};

String.mb_length = function(str) {
	str = encodeURIComponent(str);
	var len = str, mlen = 0, i;
	while (i < len) {
		if (str[i] == '%') {
			i += 3;
		} else {
			i++;
		}
		mlen++;
	}
	return mlen;
};

Util = {};

Util.Validate = {
	url: function(str) {
		var pattern = /^\b(((https?|ftp):\/\/)?[a-z0-9][a-z0-9|-|_]+(\.[-a-z0-9]+)*\.(?:com|edu|me|gov|int|mil|net|org|biz|info|name|museum|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i;
		if (pattern.test(str)) {
			return true;
		} else {
			return "URL格式错误!";
		}
	},

	email: function(email) {
		var regular = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/;
		if (!regular.test(email)) {
			return "Email格式错误!";
		} else {
			return true;
		}
	},

	filename: function(file_name) {
		if (file_name.length < 1) {
			return "文件名不能为空!";
		}
        var regular = /^[^\\/:*?<>\s\"\']{1,}$/;
		if (!regular.test(file_name)) {
			return "文件名不能包含下列任意字符之一\n\ / :. * ?\" < > |";
		}
		return true;
	},

	Desc: function(description) {
		if (description.length > 11500) {
			return '描述字符长度不能超过11500字节';
		}
		return true;
	},

	CategoryName: function(category_name) {
		category_name = category_name.replace(' ', '');
		if (category_name.length < 1) {
			return '目录名称不能为空。';
		}
		if (category_name.length > 50) {
			return '目录名称不能超过50个字。';
		}
		var regular = /^[^\\/:*?<>\|\\\\\"]*$/;
		if (!regular.test(category_name)) {
			return "目录名称不能包含下列任意字符之一\n\ \\ / : * ? \"  < > |";
		}
		return true;
	}
};

Util.File = {
	show_size: function(bytes, fix) {
		bytes = parseInt(Number(bytes));
		var unit = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB", "DB", "NB"],
			len = unit.length, i = 0, ext;

		while (bytes >= 1024 && i < len) {
			bytes /= 1024;
			i++;
		}
		ext = unit[i];

		return Number(bytes).toFixed((fix === undefined) ? 2 : fix) + ext;
	}
};

Util.Text = {
	cut: function(str, count) {
		if (str.length > count) {
			var half = count / 2, len = str.length;
			return str.substring(0, half) + "..." + str.substring(len - half, len);
		}
	}
};

Util.Date = {
	GetTimeText:function(num){
		var arr = [3600,60];
		var result = "";
		for(var i = 0,len = arr.length; i < len; i++){
			var item = arr[i];
			if(num >= item){
				var s = (num / item).toFixed(0);
				result += Util.Date._getDoubleText(s) + ":";
				num = num % item;
			}
			else{
				result += "00:";
			}
		}
		result += Util.Date._getDoubleText(num);
		return result;
	},
	GetIMText: function(h,m,s){
		var txt = [];
		if(h < 10){
			txt.push("0" + h);
		}
		else{
			txt.push(h);
		}
		if(m < 10){
			txt.push("0" + m);
		}
		else{
			txt.push(m);
		}
		if(s < 10){
			txt.push("0" + s);
		}
		else{
			txt.push(s);
		}
		return txt.join(":");
	},
	_getDoubleText: function(num){
		if(num.toString().length > 1){
			return num;
		}
		else{
			return "0" + num.toString();
		}
	}
};

Util.Cookie = {
	get: function(key) {
		var cookies = document.cookie.split(';');

		for (var i = 0, len=cookies.length; i < len; i++) {
			var cookie = cookies[i];
			cookie = cookie.replace(/^\s+/, "");
			var parts = cookie.split('=');
			if (parts[0] === key)
				return unescape(parts[1]);
		}
		return "";
	},

	set: function(key, value, expires, path, domain, secure) {
		if (expires) {
			expires = new Date((new Date()).getTime() + expires * 3600000);
		}
		document.cookie = key + "=" + escape(value) +
			(expires ? ";expires=" + expires.toGMTString() : "") + 
			(path ? ";path=" + path : "") +
			(domain ? ";domain=" + domain : "") +
			(secure ? ";secure=" + secure : "");
	},

	del: function(key, path, domain) {
		if (Util.Cookie.get(key)) {
			document.cookie = name + "=" +
				(path ? ";path=" + path : "") +
				(domain ? ";domain=" + domain : "") +
				";expires=Thu, 01-Jan-1970 00:00:01 GMT";
		}
	}
};

var misc_templates = _.template(require('vuuvv/templates/misc.html'));

Util.template = function(name, options) {
	options = options || {};
	options["_name"] = name;
	return misc_templates(options);
};

Util.stop_propagation = function(e) {
	if ($.browser.msie) {
		event.cancelBubble = true;
	} else {
		e.stopPropagation();
		e.preventDefault();
	}
};

Util.center = function(box, options) {
	var parent,
		cut = 0,
		ptop = 0,
		pleft = 0;

	if (options) {
		if (options.parent) {
			parent = options.parent;
			var offset = parent.offset();
			ptop = offset.top;
			pleft = offset.left;
		} else {
			parent = $(window);
		}
		if (options.cut != undefined) {
			cut = options.cut;
		}
	} else {
		parent = $(window);
	}

	var top = (parent.height() - box.height()) / 3 + cut + ptop,
		left = (parent.width() - box.width()) / 2 + cut + pleft,
		stop = parent.scrollTop();

	top = Math.max(0, top);
	left = Math.max(0, left);

	if (stop) {
		top += stop;
	}

	box.css({
		top: top,
		left: left
	});
};

});
