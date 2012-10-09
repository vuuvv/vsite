$(function() {
	var colors = {
		"北京市": "#FBC5DC",
		"上海市": "#FCFBBB",
		"天津市": "#C8C1E3",
		"重庆市": "#FBC5DC",
		"广东省": "#FBC5DC",
		"湖南省": "#DBEDC7",
		"贵州省": "#E7CCAF",
		"云南省": "#DBEDC7",
		"福建省": "#FEFCBF",
		"江西省": "#E7CCAF",
		"浙江省": "#C8C1E3",
		"安徽省": "#FBC5DC",
		"湖北省": "#C8C1E3",
		"河南省": "#DBECC8",
		"江苏省": "#DBECC8",
		"四川省": "#FCFBBB",
		"海南省": "#FCFBBB",
		"山东省": "#FCFBBB",
		"辽宁省": "#FCFBBB",
		"陕西省": "#E7CCAF",
		"河北省": "#E7CCAF",
		"黑龙江省": "#E7CCAF",
		"青海省": "#DBEDC7",
		"甘肃省": "#C8C1E3",
		"山西省": "#FBC5DC",
		"吉林省": "#C8C1E3",
		"宁夏回族自治区": "#FBC5DC",
		"广西壮族自治区": "#C8C1E3",
		"新疆维吾尔自治区": "#FCFBBB",
		"西藏自治区": "#E7CCAF",
		"内蒙古自治区": "#DBEDC7",
		"香港特别行政区": "#C8C1E3",
		"澳门特别行政区": "#C8C1E3"
	};
	var Map = function(options) {
		this.initialize(options);
	};

	Map.prototype = {
		defaults: {
			zoom: 5,
			center: new BMap.Point(105.724609, 36.807512)
		},

		initialize: function(options) {
			var opts = $.extend({}, this.defaults, options);
			var map = this.map = new BMap.Map($(opts.element)[0]);
			map.centerAndZoom(opts.center, opts.zoom);
			map.addControl(new BMap.NavigationControl());
			map.addControl(new BMap.MapTypeControl());
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

		create_boundaries: function() {
			var self = this;
			var poly_opts = {
				strokeColor: "#9b868b",
				//fillColor: "#FF8c69",
				fillOpacity: 0.6,
				strokeWeight: 1,
				zIndex: 1
			};
			var bdary = new BMap.Boundary();
			var create_boundary = function(province, rs) {
				bdary.get(province, function(rs) {
					for (var i = 0, len=rs.boundaries.length; i < len; i++) {
						poly_opts.fillColor = colors[province];
						var ply = new BMap.Polygon(rs.boundaries[i], poly_opts);
						self.map.addOverlay(ply);
					}
				});
			};
			var delay = function(key, map, boundaries) {
				return function() {
					var ply = new BMap.Polygon(boundaries[key], {strokeWeight: 1, strokeColor: "#ff0000"});
					map.addOverlay(ply);
				};
			};
			var on_response = function(data) {
				var boundaries = data.boundaries;
				self.map.clearOverlays();
				var i = 0;
				funcs = [];
				for (var key in boundaries) {
					//var func = function() {
					//	var ply = new BMap.Polygon(boundaries[key], {strokeWeight: 2, strokeColor: "#ff0000"});
					//	self.map.addOverlay(ply);
					//};
					funcs.push(delay(key, self.map, boundaries));
					//create_boundary(key);
				}
				for (var i = 0; i < funcs.length; i++) {
					//setTimeout(funcs[i], 100 * i);
				};
			};
			$.getJSON("/sales/dealer/boundary/", on_response);
		},

		create_markers: function() {
			var self = this;
			var dealer_info = function(dealer) {
				var html = '<p><a href="">' + '</a></p>';
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

	window.Map = Map;
});
