define(function(require, exports, module) {

if (!window.vuuvv) {
	window.vuuvv = {};
}

var _count = function(text, find, start, end) {
	var re = new RegExp(find, "g"),
		start = start || 0,
		text = text.substring(start, end),
		m = text.match(re);
	return m ? m.length : 0;
}

var _Reader = function(text) {
	this.text = text;
	this.line = 1;
	this.pos = 0;
};

_Reader.prototype = {
	find: function(needle, start) {
		var pos = this.pos, index;
		start = start || 0;
		start += pos;
		index = self.text.indexOf(needle, start);
		if (index != -1)
			index -= pos;
		return index;
	},

	consume: function(count) {
		if (count == null) 
			count = this.text.length - this.pos;
		var newpos = self.pos + count,
			s = this.text.substring(this.pos, newpos);
		self.line += _count(this.text, "\n");
		self.pos = newpos;
		return s;
	},

	remaining: function() {
		return this.text.length - self.pos;
	}
}

var Template = function(text) {
	this.reader = _Reader(text);
};

Template.prototype = {
	_generate_code: function() {
	},

	generate: function() {
	}
};

vuuvv.template = function(text) {
	return new Template(text);
};

});
