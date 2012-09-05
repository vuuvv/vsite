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
		var listeners = getListener(this, type), r, fn;
		if (listeners) {
			for (var i = listeners.length - 1; i >= 0; i--) {
				r = listeners[i].apply(this, arguments);
			}
		}
		fn = this['on_' + type.toLowerCase()];
		if (fn)
			r = fn.apply(this, arguments);
		return r;
	}
};

var __uid = 0;

var helpers = VUI.helpers = {
	/**
	 * 产生uid
	 * @return {Number} 返回uid
	 */
	uid: function() {
		return ++__uid;
	},

	/**
	 * 获取整个页面的viewport
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
	}
};

});
