define(function(require, exports, module) {

var vuuvv = window.vuuvv || {};

window.vuuvv = vuuvv;

window.VUI = vuuvv.ui = {};

VUI.plugins = {};

VUI.commands = {};

VUI.instants = {};

VUI.I18N = {};

VUI.version = "0.0.1";

var dom = VUI.dom = {};

var slice = Array.prototype.slice,
	unshift = Array.prototype.unshift,
	toString = Object.prototype.toString,
	hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * @class vuuvv.ui.browser 判断浏览器
 */

var browser = vuuvv.browser = function() {
	var agent = navigator.userAgent.toLowerCase(),
		opera = window.opera,
		browser = {
			/**
			 * 检测浏览器是否为IE
			 * @name vuuvv.ui.browser.ie
			 * @property 检测浏览器是否为IE
			 * @grammar vuuvv.ui.browser.ie
			 * @return {Boolean} 返回是否为IE浏览器
			 */
			ie: !!window.ActiveXObject,

			/**
			 * 检测浏览器是否为Opera
			 * @name vuuvv.ui.browser.opera
			 * @property 检测浏览器是否为Opera
			 * @grammar vuuvv.ui.browser.opera
			 * @return {Boolean} 返回是否为Opera浏览器
			 */
			 opera: (!!opera && opera.version),

			/**
			 * 检测浏览器是否为WebKit
			 * @name vuuvv.ui.browser.webkit
			 * @property 检测浏览器是否为WebKit
			 * @grammar vuuvv.ui.browser.webkit
			 * @return {Boolean} 返回是否为WebKit浏览器
			 */
			 webkit: ( agent.indexOf( ' applewebkit/' ) > -1 ),

			/**
			 * 检测浏览器是否为Macintosh系统
			 * @name vuuvv.ui.browser.mac
			 * @property 检测浏览器是否为Macintosh系统
			 * @grammar vuuvv.ui.browser.mac
			 * @return {Boolean} 返回是否为Macintosh系统
			 */
			 mac: ( agent.indexOf( 'macintosh' ) > -1 ),

			/**
			 * 检测浏览器是否为quirks模式
			 * @name vuuvv.ui.browser.quirks
			 * @property 检测浏览器是否为quirks模式
			 * @grammar vuuvv.ui.browser.quirks
			 * @return {Boolean} 返回是否为quirks模式
			 */
			 quirks: ( document.compatMode == 'BackCompat' )
		};

	/**
	 * 检测浏览器是否为Gecko内核，如Firefox
	 * @name baidu.editor.browser.gecko
	 * @property    检测浏览器是否为Gecko内核
	 * @grammar     baidu.editor.browser.gecko
	 * @return     {Boolean}    返回是否为Gecko内核
	 */
	browser.gecko = ( navigator.product == 'Gecko' && !browser.webkit && !browser.opera );

	var version = 0;

	if (browser.ie) {
		version = parseFloat(agent.match(/msie (\d+)/)[1]);
		browser.ie9Compat = document.documentMode == 9;
		browser.ie8 = !!document.documentMode;
		browser.ie8Compat = document.documentMode == 8;
		browser.ie7Compat = ((version == 7 && !document.documentMode)
							 || document.documentMode == 7);
		browser.ie6Compat = (version < 7 || browser.quirks);
	}

	// Gecko.
	if ( browser.gecko )
	{
		var geckoRelease = agent.match( /rv:([\d\.]+)/ );
		if ( geckoRelease )
		{
			geckoRelease = geckoRelease[1].split( '.' );
			version = geckoRelease[0] * 10000 + ( geckoRelease[1] || 0 ) * 100 + ( geckoRelease[2] || 0 ) * 1;
		}
	}
	/**
	 * 检测浏览器是否为chrome
	 * @name baidu.editor.browser.chrome
	 * @property    检测浏览器是否为chrome
	 * @grammar     baidu.editor.browser.chrome
	 * @return     {Boolean}    返回是否为chrome浏览器
	 */
	if (/chrome\/(\d+\.\d)/i.test(agent)) {
		browser.chrome = + RegExp['\x241'];
	}
	/**
	 * 检测浏览器是否为safari
	 * @name baidu.editor.browser.safari
	 * @property    检测浏览器是否为safari
	 * @grammar     baidu.editor.browser.safari
	 * @return     {Boolean}    返回是否为safari浏览器
	 */
	if(/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent)){
		browser.safari = + (RegExp['\x241'] || RegExp['\x242']);
	}


	// Opera 9.50+
	if ( browser.opera )
		version = parseFloat( opera.version() );

	// WebKit 522+ (Safari 3+)
	if ( browser.webkit )
		version = parseFloat( agent.match( / applewebkit\/(\d+)/ )[1] );

	/**
	 * 浏览器版本
	 *
	 * gecko内核浏览器的版本会转换成这样(如 1.9.0.2 -> 10900).
	 *
	 * webkit内核浏览器版本号使用其build号 (如 522).
	 * @name baidu.editor.browser.version
	 * @grammar     baidu.editor.browser.version
	 * @return     {Boolean}    返回浏览器版本号
	 * @example
	 * if ( baidu.editor.browser.ie && <b>baidu.editor.browser.version</b> <= 6 )
	 *     alert( "Ouch!" );
	 */
	browser.version = version;

	return browser;
}();

/**
 * @class vuuvv.ui.utils 工具类
 */

var utils = vuuvv.utils = {
	/**
	 * 以obj为原型(prototype)创建实例，主要用于类继承中
	 * @public
	 * @function
	 * @param {Object} obj
	 * @return {Object} 返回新对象
	 */
	make_instance: function(obj) {
		var cls = new Function();
		cls.prototype = obj;
		obj = new cls;
		cls.prototype = null;
		return obj;
	},

	/**
	 * 将对象s的属性扩展（复制）到对象t中
	 * @public
	 * @function
	 * @param {Object} t
	 * @param {Object} s
	 * @param {Boolean} b 如果t中经存在相同的属性，true：保留，false：覆盖
	 * @return {Object} 返回扩展后的新对象
	 */
	extend: function(t, s, b) {
		if (s != null) {
			for (var k in s) {
				if (!b || !t.hasOwnProperty(k))
					t[k] = s[k];
			}
		}
		return t;
	},
	
	/**
	 * 判断是否为数组
	 * @public
	 * @function
	 * @param {Object} array
	 * @return {Boolean} true：是数组，false：非数组
	 */
	is_array: function(array) {
		return toString.call(obj) == '[object Array]';
	},

	/**
	 * 判断是否为字符串
	 * @public
	 * @function
	 * @param {Object} str
	 * @return {Boolean} true：是字符串， false：非字符串
	 */
	is_string: function(str) {
		return typeof str == 'string' || str.constructor == String;
	},

	/**
	 * 判断是否为函数
	 * @public
	 * @function
	 * @param {Object} fn
	 * @return {Boolean} true：是函数，false：非函数
	 */
	is_function: function(fn) {
		return toString.call(fn) == '[object Function]';
	},


	/**
	 * 判断是否为空对象
	 * @public
	 * @function
	 * @param {Object} obj
	 * @return {Boolean} true：是空对象，false：非空对象
	 */
	is_empty: function(obj) {
		for (var k in obj) {
			return false;
		}
		return true;
	},

	/**
	 * 类sub继承类super
	 * @public
	 * @function
	 * @param {Object} sub 子类
	 * @param {Object} super 父类
	 * @return {Object} 继承super的sub
	 */
	inherits: function(sub, super_) {
		var sub_p = sub.prototype,
			new_p = utils.make_instance(super_.prototype);
		utils.extend(new_p, sub_p, true);
		sub.prototype = new_p;
		return (new_p.constructor = sub);
	},

	/**
	 * 为函数指定this对象
	 * @public
	 * @function
	 * @param {Function} fn 需要绑定的函数
	 * @param {Object} self 指定的this对象
	 * @return {Function} 绑定后的函数
	 */
	bind: function(fn, self) {
		return function() {
			return fn.apply(self, arguments);
		};
	},

	/**
	 * 创建延迟执行的函数
	 * @public
	 * @function
	 * @param {Function} fn 要执行的函数
	 * @param {Number} delay 延迟时间，单位为毫秒
	 * @param {Boolean} exclusion 是否互斥执行，true：函数执行是会把上一次还未执行的延迟函数终止
	 * @return {Function} 会延迟执行的函数
	 */
	defer: function(fn, delay, exclusion) {
		var timer;
		return function() {
			if (exclusion) {
				clearTimeout(timer);
			}
			timer = setTimeout(fn, delay);
		};
	},

	/**
	 * 查找元素在数组中第一个位置的索引，若不存在则返回-1
	 * @public
	 * @function
	 * @param {Array} array 要查找的数组
	 * @param {*} item 要查找的元素
	 * @param {Number} start 开始查找的位置
	 * @return {Number} 返回元素在数组中第一个位置的索引，-1代表查找不到
	 */
	find: function(array, item, start) {
		for (var i = at || 0, len = array.length; i < len; i++) {
			if (array[i] === item) {
				return i;
			}
		}
		return -1;
	},

	/**
	 * 将指定的元素从数组中全部删除
	 * @public
	 * @function
	 * @param {Array} array 要删除元素的数组
	 * @param {*} item 要删除的元素
	 * @return {Number} 返回删除了多少个指定的元素
	 */
	remove: function(array, item) {
		var n = 0;
		for (var i = 0, len = array.length; i < len; i++) {
			if (array[i] === item) {
				array.splice(i, 1);
				i--;
				n++;
			}
		}
	},

	/**
	 * 删除字符串首尾的空白字符
	 * @public
	 * @function
	 * @param {String} str 原字符串
	 * @return {string} str 删除空白字符后的字符串
	 */
	trim: function(str) {
		return str.replace(/^\s+|\s+$/g, '');
	},

	/**
	 * 将字符串数组或用','分隔的字符串转换成hash set
	 * @public
	 * @function
	 * @param {Array/String} list 字符串数组或以','分隔的字符串
	 * @return {string} str 转换后的hash set
	 */
	to_set: function(list) {
		if (!list) return {};
		list = utils.is_array(list) ? list : list.split(',');
		var ci, obj = {};
		for (var i = 0, len = list.length; i < len; i++) {
			obj[ci.toUpperCase()] = obj[ci] = 1;
		}
		return obj;
	},

	/** 
	 * 将字符串str中的html符号（&<">）转义
	 * @public
	 * @function
	 * @param {String} str 需要转义的字符串
	 * @return {String} 转义后的字符串
	 */
	escape: function(str) {
		return str ? str.replace(re || /[&<">]/g, function(m){
			return {
				'<': '&lt;',
				'&': '&amp;',
				'"': '&quot;',
				'>': '&gt;'
			}[m]
		}) : '';
	},

	/**
	 * 将转义后的字符串str转成没有转义时的字符串
	 * @public
	 * @function
	 * @param {String} str 转义后的字符串
	 * @return {String} 反转义后的字符串
	 */
	unescape: function(str) {
		return str ? str.replace(/&((g|l|quo)t|amp);/g, function(m){
			return {
				'&lt;':'<',
				'&amp;':'&',
				'&quot;':'"',
				'&gt;': '>'
			}[m]
		}) : '';
	},

	template: function(text, data, settings) {
		var re = /{%\s*define\s+(\S+)\s+%}([\s\S]*?){%\s*end\s+define\s*%}/g;
		var result = {};
		while(1) {
			var match = re.exec(text);
			if (!match)
				break;
			result[match[1]] = _.template(match[2], data, settings);
		}
		return result;
	},

	/**
	 * 获取节点所在的window对象
	 * @param {Node} node 指定节点
	 * @return {window} 节点所在的window
	 */
	get_window: function(node) {
		var doc = node.ownerDocument || node;
		return doc.defaultView || doc.parentWindow;
	}
};

/**
 * 事件类
 * @public
 * @class vuuvv.ui.Event
 */
var Event = VUI.Event = function(){};

/**
 * 从对象中获取指定监听事件类型的所有监听器
 * @public
 * @function
 * @param {Object} obj 监听的对象
 * @param {String} type 监听的事件类型
 * @param {Boolean} force 当force为真且监听的事件并不存在时，返回以个空的数组
 * @return {Array} 监听器数组
 */
var get_listener = function(obj, type, force) {
	var all;
	type = type.toLowerCase();
	return ((all = (obj.__events || force && (obj.__events={})))
			&& (all[type] || force && (all[type] = [])));

};

Event.prototype = {
	/**
	 * 注册事件监听器
	 * @public
	 * @function
	 * @param {String} type 事件类型
	 * @param {function} listener 监听函数
	 */
	add_listener: function(type, listener) {
		get_listener(this, type, true).push(listener);
	},

	/**
	 * 移除事件监听器
	 * @public
	 * @function
	 * @param {String} type 事件类型
	 * @param {Function} listener 监听函数
	 */
	remove_listener: function(type, listener) {
		var listeners = get_listener(this, type);
		if (listeners)
			utils.remove(listeners, listener);
	},

	/**
	 * 触发事件, type后的参数将传入listener函数中作为参数，除了可以触发
	 * add_listener添加的监听事件，如果该obj中有形式为on_type的函数也会
	 * 被触发
	 * @public
	 * @function
	 * @param {String} type 事件名
	 */
	fire_event: function(type) {
		var listeners = get_listener(this, type), r, fn;
		var args = slice.call(arguments, 1);
		if (listeners) {
			for (var i = listeners.length - 1; i >= 0; i--) {
				r = listeners[i].apply(this, args);
			}
		}
		fn = this['on_' + type.toLowerCase()];
		if (fn) {
			r = fn.apply(this, args);
		}
		return r;
	}
};

var __uid = 0;

var FIXED_LAYER_ID = 'vui_fixedlayer';

function update_fixed_offset() {
	var layer = document.getElementById(FIXED_LAYER_ID);
	helpers.set_viewport_offset(layer, {
		left: 0,
		top: 0
	});
}

function bind_fixed_layer() {
	$(window).on('scroll', update_fixed_offset);
	$(window).on('resize', utils.defer(update_fixed_offset, 0, true));
}

var helpers = VUI.helpers = {
	/**
	 * 产生uid
	 * @return {Number} 返回uid
	 */
	uid: function() {
		return ++__uid;
	},

	/**
	 * 获取整个页面的viewport, viewport就是浏览器的屏幕
	 * @return {Element} 页面的viewport
	 */
	get_viewport: function() {
		return (browser.ie && browser.quirks) ?
			document.body : document.documentElement;
	},

	/**
	 * 返回一个dom元素在屏幕中的位置和大小信息
	 * @param {Element} elem 指定的dom元素
	 * @return {Object} 描述该元素在屏幕中的位置和大小信息
	 */
	get_client_rect: function(elem) {
		var bound;
		try {
			bound = elem.getBoundingClientRect();
		} catch(e) {
			bound = {left: 0, top: 0, right: 0, bottom: 0};
		}
		var rect = {
			left: Math.round(bound.left),
			top: Math.round(bound.top),
			height: Math.round(bound.bottom - bound.top),
			width: Math.round(bound.right - bound.left)
		};
		while ((doc = elem.ownerDocument) !== document &&
			   (elem = utils.get_window(doc).frameElement)) {
			bound = elem.getBoundingClientRect();
			rect.left += bound.left;
			rect.top += bound.top;
		}
		rect.bottom = rect.top + rect.heigth;
		rect.right = rect.left + rect.width;
		return rect;
	},

	/**
	 * 返回viewport在屏幕中的位置和大小信息
	 * @return {Object} 描述viewport在屏幕中的位置和大小信息
	 */
	get_viewport_rect: function() {
		var viewport = helpers.get_viewport();
		var width = (window.innerWidth || viewport.clientWidth) | 0;
		var height = (window.innerHeight || viewport.clientHeight) | 0;
		return {
			left: 0,
			top: 0,
			height: height,
			width: width,
			bottom: height,
			right: width
		}
	},

	/**
	 * 在viewport上给element设定位置，element须为顶级的ui所在的dom,
	 * 其实可以理解为绝对定位。
	 * @public
	 * @function
	 * @param {Element} elem 被放置的元素，应为顶级ui元素，如dialog等
	 * @param {Object} offset 指定的位置
	 */
	set_viewport_offset: function(elem, offset) {
		var rect;
		var fixed = helpers.get_fixed_layer();
		if (elem.parentNode === fixed) {
			$(elem).css({
				left: offset.left,
				top: offset.top
			});
		} else {
			var left = parseInt(elem.style.left) | 0;
			var top = parseInt(elem.style.top) | 0;
			var rect = elem.getBoundingClientRect();
			var ol = offset.left - rect.left;
			var ot = offset.top - rect.top;
			if (ol) 
				elem.style.left = left + ol + 'px';
			if (ot)
				elem.style.top = top + ot + 'px';
		}
	},

	/**
	 * 获取该事件发生时所在屏幕的位置
	 * @param {Object} evt 产生的事件
	 * @return {Object} 事件发生时所在的位置信息
	 */
	get_viewport_offset_by_event: function(evt) {
		var el = evt.target || evt.srcElement;
		var frame = utils.get_window(el).frameElement;
		var offset = {
			left: evt.clientX,
			top: evt.clientY
		};
		if (frame && el.ownerDocument !== document) {
			var rect = helpers.get_client_rect(frame);
			offset.left += rect.left;
			offset.top += rect.top;
		}
		return offset;
	},

	/**
	 * 获取该事件发生时相对于产生该事件的元素的位置
	 * @param {Object} evt 产生的事件
	 * @return {Object} 事件相对于产生该事件的元素的位置信息
	 */
	get_event_offset: function(evt) {
		var el = event.target || event.srcElement;
		var rect = helpers.get_client_rect(el);
		var offset = helpser.get_viewport_offset_by_event(evt);
		return {
			left: offset.left - rect.left,
			top: offset.top - rect.top
		}
	},

	/**
	 * 获取或产生一个用于fixed定位的层（layer），主要用于dialog等popup组件。
	 * @return {Element} 一个用于fixed定位的层
	 */
	get_fixed_layer: function() {
		var layer = document.getElementById(FIXED_LAYER_ID);
		if (layer == null) {
			layer = document.createElement('div');
			layer.id = FIXED_LAYER_ID;
			document.body.appendChild(layer);
			if (browser.ie && browser.version <= 8) {
				layer.style.position = 'absolute';
				bind_fixed_layer();
				setTimeout(update_fixed_offset);
			} else {
				layer.style.position = 'fixed';
			}
			layer.style.left = '0';
			layer.style.top = '0';
			layer.style.width = '0';
			layer.style.height = '0';
			layer.style.zIndex = '1000';
		}
		return layer;
	},

	copy_attrs: function(tar, src) {
		var attrs = src.attributes;
		var i = attributes.length;
		while (i--) {
			var attr_node = attributes[i];
			if (attr_node.nodeName != 'style' && attr_node.nodeName != 'class' && (!browser.ie || attr_node.specified)) {
				tar.setAttribute(attr_node.nodeName, attr_node.nodeValue);
			}
		}
		if (src.className) {
			tar.className += ' ' + src.className;
		}
		if (src.style.cssText) {
			tar.style.cssText += ';' + src.style.cssText;
		}
	}
};

/* minixs */

var inherits = function(cls, pcls) {
	var len = arguments.length;
	var p = cls.prototype;
	var init = p.initialize;
	var funcs = [pcls.prototype.initialize];
	if (len > 2) {
		for (var i = 2; i < len; i++) {
			var minix = arguments[i];
			if (minix.initialize)
				funcs.push(minix.initialize);
			utils.extend(p, minix);
		}
	}
	if (init)
		funcs.push(init);
	utils.inherits(cls, pcls);
	cls.prototype.initialize = function(options) {
		for (var i = 0, size = funcs.length; i < size; i++) {
			funcs[i].apply(this, arguments);
		}
		if (this.auto_render)
			this.render();
	}
};

vuuvv.inherits = inherits;

var state_prefix = 'vui-state-';

var Stateful = VUI.Stateful = {
	stateful: true,

	initialize: function(options) {
		this.add_listener('postrender', this.make_stateful);
	},

	has_state: function(state) {
		$(this.get_dom("state")).hasClass(state_prefix + state);
	},

	add_state: function(state) {
		$(this.get_dom("state")).addClass(state_prefix + state);
	},

	remove_state: function(state) {
		$(this.get_dom("state")).removeClass(state_prefix + state);
	},

	enable: function() {
		if (arguments.length === 0)
			return !this.has_state("disabled");
		if (arguments[0]) {
			this.remove_state("disabled");
		} else {
			this.remove_state("hover");
			this.remove_state("checked");
			this.remove_state("active");
			this.add_state("disabled");
		}
	},

	check: function() {
		if (arguments.length === 0)
			return this.has_state("checked");
		if (this.enable() && arguments[0]) {
			this.add_state("checked");
		} else {
			this.remove_state("checked");
		}
	},

	make_stateful: function() {
		if (!this.stateful)
			return;
		var layer = this.get_dom("state");
		if (!layer) {
			var html = ui_template["vui_state"](this);
			this.$elem.wrapInner(html);
			layer = this.get_dom("state");
		}
		var self = this;
		$(layer).mouseover(function() {
			if (self.enable()) {
				self.add_state("hover");
				self.fire_event("hover");
			}
		}).mouseout(function() {
			if (self.enable()) {
				self.remove_state("hover");
				self.remove_state("active");
				self.fire_event("blur");
			}
		}).mousedown(function() {
			if (self.enable()) {
				self.add_state("active");
			}
		}).mouseup(function() {
			if (self.enable()) {
				self.remove_state("active");
			}
		});
	}
};

var empty = function(){};

var Action = VUI.Action = {
	action: empty,

	initialize: function(options) {
		this.do_action = utils.bind(this.do_action, this);
		this.add_listener('postrender', this.make_action);
	},

	do_action: function() {
		var action = this.action;
		if (utils.is_function(action)) {
			action();
		} else if (utils.is_string(action)) {
			VUI.App.navigate(action);
		}
	},

	make_action: function() {
		this.$elem.click(this.do_action);
	}
};

var Draggable = VUI.Draggable = {
	draggable: true,
	drag_handle: '',

	initialize: function(options) {
		this.start_drag = utils.bind(this.start_drag, this);
		this._drag_mousemove = utils.bind(this._drag_mousemove, this);
		this._drag_mouseup = utils.bind(this._drag_mouseup, this);
		this._drag_release_capture = utils.bind(this._drag_release_capture, this);
		this.add_listener('postrender', this.make_draggable);
	},

	start_drag: function(evt) {
		var doc = document;
		this.drag_start_x = evt.clientX;
		this.drag_start_y = evt.clientY;
		this.client_rect = this.get_client_rect();
		if (doc.addEventListener) {
			doc.addEventListener('mousemove', this._drag_mousemove, true);
			doc.addEventListener('mouseup', this._drag_mouseup, true);
			window.addEventListener('mouseup', this._drag_mouseup, true);
			evt.preventDefault();
		} else {
			var elm = evt.srcElement;
			elm.setCapture();
			elm.attachEvent('onmousemove', this._drag_mousemove);
			elm.attachEvent('onmouseup', this._drag_release_capture);
			elm.attachEvent('onlosecapture', this._drag_release_capture);
			evt.returnValue = false;
		}
		this.fire_event("dragstart");
	},

	get_safe_offset: function(offset) {
		var vp_rect = helpers.get_viewport_rect();
		var rect = this.get_client_rect();
		var left = offset.left;
		left = Math.min(left, vp_rect.right - rect.width);
		var top = offset.top;
		top = Math.min(top, vp_rect.bottom - rect.height);
		return {left: Math.max(0, left), top: Math.max(0, top)};
	},

	_drag_mousemove: function(evt) {
		var dx = evt.clientX - this.drag_start_x;
		var dy = evt.clientY - this.drag_start_y;
		this.fire_event("dragmove", dx, dy);
		if (evt.stopPropagation) {
			evt.stopPropagation();
		} else {
			evt.cancelBubble = true;
		}
	},

	on_dragmove: function(dx, dy) {
		var rect = this.client_rect;
		console.log(dx, dy);
		var offset = this.get_safe_offset({
			left: rect.left + dx,
			top: rect.top + dy
		});
		this.$elem.css(offset);
	},

	_drag_mouseup: function(evt) {
		var doc = document;
		doc.removeEventListener("mousemove", this._drag_mousemove, true);
		doc.removeEventListener("mouseup", this._drag_mouseup, true);
		window.removeEventListener("mouseup", this._drag_mouseup, true);
		this.fire_event("dragstop");
	},

	_drag_release_capture: function(evt) {
		var elm = evt.srcElement;
		elm.releaseCapture();
		elm.detachEvent("onmousemove",this._drag_mousemove);
		elm.detachEvent("onmouseup", this._drag_release_capture);
		elm.detachEvent("onlosecapture", this._drag_release_capture);
		this.fire_event("dragstop");
	},

	make_draggable: function() {
		if (!this.draggable)
			return;
		var handle = this.get_dom(this.drag_handle);
		$(handle).mousedown(this.start_drag);
	}
};

/* UI part */
var ui_template = utils.template(require('text!vuuvv/templates/ui.html'));

var Widget = VUI.Widget = function() {};

Widget.prototype = {
	name: '',
	class_name: '',
	template: '',
	auto_render: false,

	initialize: function(options) {
		for (var k in options) {
			this[k] = options[k];
		}
		this.id = this.id || 'vui' + helpers.uid();
		if (!this.template && this.name) {
			this.template = 'vui_' + this.name;
		}
	},

	render: function(where) {
		var html = this.get_render_html();
		var $elem = this.$elem = $(html);
		var el = $elem[0];
		var box = this.get_dom();
		if (box != null) {
			box.parentNode.replaceChild(el, box);
			helpers.copy_attrs(el, box);
		} else {
			if(typeof where == 'string') {
				where = document.getElementById(where);
			}
			where = where || helpers.get_fixed_layer();
			where.appendChild(el);
		}
		this.$elem.data("obj", this);

		this.fire_event('postrender');
	},

	move_to: function(x, y) {
		var box = this.get_dom();
		helpers.set_viewport_offset(box, {
			left: x,
			top: y
		});
	},

	get_render_html: function() {
		return ui_template[this.template](this);
	},

	get_client_rect: function(name) {
		return helpers.get_client_rect(this.get_dom(name));
	},

	get_dom: function(name) {
		if (name) {
			return document.getElementById(this.id + '_' + name);
		} else {
			return document.getElementById(this.id);
		}
	},

	dispose: function() {
		var box = this.$elem;
		if (box) {
			box.data("obj", null);
			box.remove();
		}
	}
};

utils.inherits(Widget, Event);

var Mask = VUI.Mask = function(options) {
	this.initialize(options);
};

Mask.prototype = {
	name: 'mask',
	template: "vui_mask",

	on_postrender: function() {
		var self = this;
		$(window).on('resize', function() {
			setTimeout(function () {
				if (self.$elem.is(":visible"))
					self._fill();
			});
		});

		this.$elem.on('mousedown', function() {
			return false;
		});
	},

	show: function(z_index) {
		this._fill();
		this.$elem.css({
			display: '',
			zIndex: z_index
		});
	},

	hide: function() {
		this.$elem.hide();
	},

	_fill: function() {
		var rect = helpers.get_viewport_rect();
		this.$elem.css({
			width: rect.width,
			height: rect.height
		});
	}
};

utils.inherits(Mask, Widget);

var Button = VUI.Button = function(options) {
	this.initialize(options);
};

Button.prototype = {
	name: 'button',
	template: "vui_button",
	label: '',
	title: '',
	show_icon: true,
	show_text: true,

	on_postrender: function() {
		var self = this;
		var body = this.get_dom("body");
		$(body).click(function() {
			if (self.enable())
				self.fire_event('click');
		});
	}
};

inherits(Button, Widget, Stateful, Action);

var Dialog = VUI.Dialog = function(options) {
	this.initialize(options);
};

Dialog.prototype = {
	name: 'dialog'
};

inherits(Dialog, Widget, Draggable);

var Popup = VUI.Popup = function(options) {
	this.initialize(options);
};

Popup._current = null;

Popup.clear = function(el) {
	var curr = Popup._current;
	if (curr && !curr.hidden() && curr.should_hide(el)) {
		curr.hide();
		Popup._current = null;
	}
};

$(document).on("mousedown", function(evt) {
	var el = evt.target || evt.srcElement;
	Popup.clear(el);
});

$(window).on("scroll", function(evt) {
	Popup.clear();
});

Popup.prototype = {
	name: 'popup',
	template: 'vui_popup',
	shadow_radius: 5,
	content: null,

	on_postrender: function() {
		this.set_content(this.content);
		this.hide();
		this.fire_event("after_post_render");
	},

	set_content: function(content) {
		var box = this.get_dom("content");
		if (content) {
			if (utils.is_string(content)) {
				$(box).append(content);
			} else {
				content.render(box);
			}
		}
		this.content = content;
	},

	content_rect: function() {
		return helpers.get_client_rect(this.get_dom("content"));
	},

	show: function(x, y) {
		var box = this.get_dom();
		if (this.hidden()) {
			Popup.clear();
			if (!box) {
				this.render();
				box = this.get_dom();
			}
			$(box).show();

			Popup._current = this;
			this.move_to(x, y);
			this.fire_event("show");
		} else {
			this.move_to(x, y);
		}
		// fix ie6 bug
		var body = $(this.get_dom());
		var shadow = $(this.get_dom("shadow"));
		shadow.width(body.width());
		shadow.height(body.height());
	},

	hide: function() {
		if (!this.hidden()) {
			$(this.get_dom()).hide();
			this.fire_event("hide");
		}
	},

	hidden: function() {
		var dom = this.get_dom();
		if (!dom)
			return true;
		return !$(dom).is(":visible");
	},

	should_hide: function(el) {
		return !(el && $.contains(this.get_dom(), el));
	}
};

inherits(Popup, Widget);

var MenuItem = VUI.Menu = function(options) {
	this.initialize(options);
};

MenuItem.prototype = {
	name: "menuitem",
	template: "vui_menuitem",
	icon: null,
	label: '',
	sub_menu: null,
	menu: null,

	on_postrender: function() {
		var self = this;
		this.add_listener("hover", function() {
			this.menu.fire_event("submenuover", self);
			if (self.sub_menu) {
				self.show_sub_menu();
			}
		});
		if (this.sub_menu) {
			this.$elem.addClass('vui-hassubmenu');
			this.sub_menu.render();
			this.add_listener("out", function() {
				self.hide_sub_menu();
			});
			this.sub_menu.add_listener("over", function() {
			});
		}
	}
};

inherits(MenuItem, Popup, Stateful, Action);

var MenuSeparator = VUI.MenuSeparator = function(options) {
	this.initialize(options);
};

MenuSeparator.prototype = {
	name: "menu_separator",
	template: "vui_menu_separator"
};

inherits(MenuSeparator, Widget);

var Menu = VUI.Menu = function(options) {
	this.initialize(options);
};

Menu.prototype = {
	name: "menu",
	items: [],

	initialize: function(options) {
		var items = this.items;
		for (var i = 0, len = items.length; i < len; i++) {
			var item = items[i];
			if (item == '-') {
				items[i] = new MenuSeparator();
			} else {
				item.menu = this;
				items[i] = new MenuItem(item);
			}
		}
	},

	set_content: function() {
		var $content = $(this.get_dom("content"));
		var $body = $('<div class="vui-menu-body"></div>');
		var items = this.items;
		for (var i = 0, len = items.length; i < len; i++) {
			var item = items[i];
			item.render();
			$body.append(item.$elem);
		}
		$content.append($body);
	}
};

inherits(Menu, Popup);

/*
var Tree = VUI.Tree = function(options) {
	this.initialize(options);
};

Tree.prototype = {
	name: 'tree',
	nodes: [],

	on_postrender: function() {
	}
};

inherits(Tree, VUI.Widget);

var TreeNode = VUI.TreeNode = function(options) {
	this.initialize(options);
};

TreeNode.prototype = {
	name: 'treenode',
	widget: null,
	children: [],

	on_postrender: function() {
	}
};

inherits(TreeNode, VUI.Widget);
*/

var TabView = VUI.TabView = function(options) {
	this.initialize(options);
};

TabView.prototype = {
	name: "tabview",
	index: -1,

	initialize: function() {
		this.tabs = [];
	},

	on_postrender: function() {
		var elem = this.$elem;
		var parent = elem.parent();
		var rect = helpers.get_client_rect(parent[0]);
		var margin = parseInt(elem.css("margin-top"));
		elem.height(rect.height - margin);
		var bar_rect = helpers.get_client_rect(this.get_dom("bar"));
		$(this.get_dom("container")).height(rect.height - margin - bar_rect.height + 2);
	},

	select: function(index) {
		if (!_.isNumber(index)) {
			index = index.index;
		}
		if (this.index === index) 
			return;
		var tabs = this.tabs
		if (this.index >= 0) {
			tabs[this.index].btn.unselect();
			tabs[this.index].page.hide();
		}
		this.index = index;
		tabs[index].btn.select();
		tabs[index].page.show();
	},

	close: function(index) {
		var tabs = this.tabs;
		var len = tabs.length;
		if (index < 0 || index >= len || len === 0)
			return;
		var tab = tabs[index];
		/* 判断tabpage是否直接关闭，dirty page */
		if (!tab.page.close()) {
			return;
		}
		tab.btn.dispose();
		if (index === 0 && len > 1)
			tabs[1].btn.set_first();
		for (var i = index; i < len; i++) {
			var tab = tabs[i];
			tab.btn.set_index(i - 1);
			tab.page.set_index(i - 1);
		}
		tabs.splice(index, 1);
		if (index < this.index)
			this.index--;
	},

	insert: function(index, title, page) {
		var tabs = this.tabs;
		var len = tabs.length;
		var bar = $(this.get_dom("bar"));
		var container = $(this.get_dom("container"));
		index = Math.min(index, len);
		var btn = new VUI.TabButton({
			title: title,
			index: index
		});
		page.index = index;
		var tab = {
			btn: btn,
			page: page
		};
		btn.render();
		page.render();
		if (index === 0) {
			btn.set_first();
			if (len > 0) {
				tabs[0].btn.set_first(false);
			}
		}
		if (index === len) {
			bar.append(btn.$elem);
		} else {
			var pos = tabs[index].btn.$elem;
			for (var i = index; i < len; i++) {
				tabs[i].btn.set_index(i+1);
				tabs[i].page.set_index(i+1);
			}
			btn.$elem.insertBefore(pos);
		}
		container.append(page.$elem);
		page.hide();
		tabs.splice(index, 0, tab);
		btn.add_listener("selected", utils.bind(this.select, this));
		btn.add_listener("close", utils.bind(this.close, this));
		return index;
	},

	append: function(title, page) {
		return this.insert(this.tabs.length, title, page);
	}
};

inherits(TabView, VUI.Widget);

var TabPage = VUI.TabPage = function(options) {
	this.initialize(options);
};

TabPage.prototype = {
	name: "tabpage",
	index: 0,

	set_content: function(content) {
		var dom = this.get_dom("content");
	},

	add_btn: function(btn) {
	},

	close: function() {
		this.dispose();
		return true;
	},

	show: function() {
		this.$elem.show();
	},

	hide: function() {
		this.$elem.hide();
	},

	set_index: function(index) {
		this.index = index;
	}
};

inherits(TabPage, VUI.Widget);

var TabButton = VUI.TabButton = function(options) {
	this.initialize(options);
};

TabButton.prototype = {
	name: "tabbutton",
	title: '',
	index: 0,
	show_close: true,

	on_postrender: function() {
		var self = this;
		this.$elem.click(function() {
			self.fire_event("selected", self.index);
		});
		$(this.get_dom("close")).click(function() {
			self.fire_event("close", self.index);
		});
	},

	set_index: function(index) {
		this.index = index;
	},

	select: function() {
		this.add_state("selected");
	},

	unselect: function() {
		this.remove_state("selected");
		this.fire_event("unselected");
	},

	set_first: function() {
		var flag = true;
		if (arguments.length > 0) {
			flag = arguments[0];
		} 
		if (flag) {
			$(this.get_dom()).addClass("first-tab");
		} else {
			$(this.get_dom()).removeClass("first-tab");
		}
	}
};

inherits(TabButton, VUI.Widget, VUI.Stateful);

var Window = VUI.Window = function(options) {
	this.initialize(options);
};

Window.prototype = {
	name: 'window',
	template: 'vui_window',
	title: null,
	toolbar: null,
	menu: null,

	initialize: function(options) {
	}
};

});
