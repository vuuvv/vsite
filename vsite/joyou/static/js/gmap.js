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
			this.info = new gmap.InfoWindow();
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
					self.map.setZoom(8);
					//var marker = new google.maps.Marker({
					//	map: self.map,
					//	position: res.geometry.location
					//});
				} else {
					alert("对不起，搜索失败:" + status);
				}
			});
		},

		on: function(type, callback) {
			gmap.event.addListener(this.map, type, callback);
		},

		create_markers: function() {
			var self = this;
			var dealer_info = function(dealer) {
				var html = '<p><a href="">''</a></p>'
			};
			var make_marker = function(dealer) {
				var latlng = new gmap.LatLng(dealer.latitude, dealer.longitude);
				var marker = new gmap.Marker({
						map: self.map,
						position: latlng
				});
				gmap.event.addListener(marker, 'click', function(evt) {
					self.info.setContent("hi");
					self.info.open(self.map, marker);
				});
				gmap.event.addListener(marker, 'click', function(evt) {
					self.info.setContent("hi");
					self.info.open(self.map, marker);
				});
			};
			var make_it = function(data) {
				var dealers = data.dealers;
				for (var i = 0, len=dealers.length; i < len; i++) {
					var dealer = dealers[i];
					make_marker(dealer);
				}
			};
			$.getJSON("/sales/dealer/dealers/", make_it);
		}
	};

	window.GMap = GMap;
});
