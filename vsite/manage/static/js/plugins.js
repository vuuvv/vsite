/* ==========================================================
 * bootstrap-alert.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

	var dismiss = '[data-dismiss="alert"]'
		, Alert = function (el) {
			var $el = this.$el = $(el);
			$el.on('click', dismiss, _.bind(this.on_close, this))
		}

	Alert.prototype.close1 = function (e) {
		var $this = $(this)
			, selector = $this.attr('data-target')
			, $parent

		if (!selector) {
		  selector = $this.attr('href')
		  selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
		}

		$parent = $(selector)

		e && e.preventDefault()

		$parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

		$parent.trigger(e = $.Event('close'))

		if (e.isDefaultPrevented()) return

		
	},

	Alert.prototype.on_close = function (e) {
		var $this = $(this)
		e && e.preventDefault()
		this.close();
		if (e.isDefaultPrevented()) return
	},

	Alert.prototype.close = function () {
		var $this = $(this);
		$this.removeClass('in');
		var _remove = function() {
			$this.trigger('closed').hide()
		};
		$.support.transition && $parent.hasClass('fade') ?
			$parent.on($.support.transition.end, removeElement) :
			_remove()
	},

	Alert.prototype.show = function (duration) {
		var self = this;
		this.timer = setTimeOut(function() {
		}, 2000);
	}


 /* ALERT PLUGIN DEFINITION
  * ======================= */

	$.fn.alert = function (option) {
		return this.each(function () {
			var $this = $(this)
			, data = $this.data('alert')
			if (!data) $this.data('alert', (data = new Alert(this)))
			if (typeof option == 'string') data[option].call($this)
		})
	}

	$.fn.alert.Constructor = Alert


 /* ALERT DATA-API
  * ============== */

}(window.jQuery);
