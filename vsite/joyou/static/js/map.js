$(function() {
	var gmap = google.maps;

	var GMap = function(options) {
		this.initialize(options);
	};

	GMap.prototype = {
		defaults: {
			zoom: 4,
			mapTypeId: gmap.MapTypeId.ROADMAP,
			center: new gmap.LatLng(36.807512,105.724609)
		},

		initialize: function(options) {
			var opts = $.extend({}, this.defaults, options);
			this.map = new gmap.Map($(opts.element)[0], opts);
			this.geocoder = new gmap.Geocoder();
		},

		coord: function(lat, lng) {
			var latlng = new gmap.LatLng(lat, lng);
			this.map.setCenter(latlng);
		},

		address: function(address, callback) {
			var self = this;
			this.geocoder.geocode({address: address}, function(results, status) {
				if (status == gmap.GeocoderStatus.OK) {
					var res = results[0];
					self.map.setCenter(res.geometry.location);
					self.map.setZoom(14);
					alert(res.geometry.location);
					var marker = new google.maps.Marker({
						map: self.map,
						position: res.geometry.location
					});
				} else {
					alert("对不起，搜索失败:" + status);
				}
			});
		},

		on: function(type, callback) {
			gmap.event.addListener(this.map, type, callback);
		}
	};

	window.GMap = GMap;
});
