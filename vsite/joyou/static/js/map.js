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

	var COUNTRY = 5;
	var PROVINCE = 8;
	var CITY = 11;
	var STREET = 14;

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
			map.enableScrollWheelZoom();
			map.enableContinuousZoom();
		},

		coord: function(lat, lng) {
			var latlng = new gmap.LatLng(lat, lng);
			this.map.setCenter(latlng);
		},

		ip2city: function(address, callback) {
			var map = this.map;
			var city = new BMap.LocalCity();
			city.get(function(result) {
				map.setCenter(result.name);
				map.setZoom(8);
				alert(result.name);
			});
		},

		address: function(address, callback) {
			var self = this;
			var map = this.map;
			var geo = new BMap.Geocoder();
			geo.getPoint(address, function(point) {
				if (point) {
					map.centerAndZoom(point, 16);
					map.addOverlay(new BMap.Marker(point));
				}
			});
		},

		local_area: function(callback) {
			var city = new BMap.LocalCity();
			city.get(function(result) {
				var center = result.center;
				var gc = new BMap.Geocoder();
				gc.getLocation(center, function(result) {
					callback(result);
				});
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
					setTimeout(funcs[i], 100 * i);
				};
			};
			$.getJSON("/sales/dealer/boundary/", on_response);
		},

		create_marker: function(point, info) {
			var marker = new BMap.Marker(point);
			this.map.addOverlay(marker);
			if (info) {
				var info_window = new BMap.InfoWindow(info);
				marker._info_window = info_window;
				marker.addEventListener("click", function() {
					this.openInfoWindow(info_window);
				});
			}
			return marker;
		},

		remove_marker: function(marker) {
			this.map.removeOverlay(marker);
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

	var dealer_tmpl = '<li><div class="dealer-info"><a href="" class="dealer-name"></a></div><div class="dealer-address"><a href="#" class="dealer-detail">查看</a><span></span></div></li>'

	var DealerMap = function() {
		this.initialize();
	};

	DealerMap.prototype = {
		initialize: function() {
			this.$province = $("#dealer-province");
			this.$city = $("#dealer-city");
			this.$list = $("#dealer-list");
			this.$search = $("#dealer-search");
			this.markers = [];
			this.map = new Map({element: '#dealer_map'});

			this.bind_event();

			var self = this;
			this.map.local_area(function(result) {
				self.show_province(result.addressComponents.province);
			});
			// init the selector
			//var province = this.$province.val();
			//if (province != "-1")
			//	this.get_cities(province);
		},

		bind_event: function() {
			var self = this;
			var $province = this.$province;
			var $city = this.$city;
			var $search = this.$search;
			$province.change(function() {
				var val = $province.val();
				if (val != "-1")
					self.get_cities(val);
				else
					self._empty_citi_select();

			});
			$city.change(function() {
				var val = $city.val();
				if (val != "-1")
					self.get_dealers(val, CITY);
			});
			$search.click(function() {
				var area = self.get_select_area();
				if (area !== null)
					self.get_dealers(area.id, area.zoom)
				else
					alert("请选择省或市!");
				return false;
			});
		},

		get_select_area: function() {
			var city = this.$city.val();
			var province = this.$province.val();
			if (city != "-1")
				return {id: city, zoom: CITY};
			if (province != "-1")
				return {id: province, zoom: PROVINCE};
			return null;
		},

		_select_remain_first: function(dom) {
			var first = $(dom.find("option")[0]);
			first.remove();
			dom.html("");
			dom.append(first);
		},

		set_province: function(provinces) {
		},

		get_cities: function(province) {
			var self = this;
			$.getJSON("/sales/dealer/cities/" + province + "/", function(data) {
				self.set_cities(data.cities);
			})
		},

		set_cities: function(cities) {
			var $city = this.$city;
			this._select_remain_first($city);
			$.each(cities, function(i, city) {
				$city.append('<option value="' + city.id + '">' + city.name + '</option>');
			});
		},

		get_dealers: function(area, zoom) {
			var self = this;
			$.getJSON("/sales/dealer/area/" + area + "/", function(data) {
				self.set_dealers(data.dealers, zoom);
			});
		},

		set_dealers: function(dealers, zoom) {
			var self = this;
			var $list = this.$list;
			zoom = zoom || COUNTRY;
			$list.html("");
			$.each(this.markers, function(i, marker) {
				self.map.remove_marker(marker);
			});
			if (dealers[0]) {
				var d = dealers[0];
				this.map.map.centerAndZoom(
				   new BMap.Point(d.longitude, d.latitude),
				   zoom
				);
			}
			for (var i = 0, len=dealers.length; i < len; i++) {
				var dealer = dealers[i];
				var node = $(dealer_tmpl);
				node.find(".dealer-name").text(dealer.name);
				node.find(".dealer-address span").text(dealer.address);
				$list.append(node);

				// add to map
				var pt = new BMap.Point(dealer.longitude, dealer.latitude);
				var marker = this.map.create_marker(pt, this.generate_info(dealer));
				this.markers.push(marker);
				node.data("marker", marker);
				node.data("dealer", dealer);
			}
			$(".dealer-info a, .dealer-address a").click(function() {
				var node = $(this).parents("li");
				var dealer = node.data("dealer");
				var marker = node.data("marker");
				var pt = new BMap.Point(dealer.longitude, dealer.latitude);
				self.map.map.centerAndZoom(pt, STREET);
				marker.openInfoWindow(marker._info_window);
				return false;
			});
		},

		generate_info: function(dealer) {
			var ret = '<p>区域：' + dealer.name  + '</p>';
			if (dealer.contact)
				ret += '<p>联系人：' + dealer.contact  + '</p>';
			if (dealer.mobile)
				ret += '<p>手机：' + dealer.mobile  + '</p>';
			if (dealer.tel)
				ret += '<p>联系电话：' + dealer.tel  + '</p>';
			if (dealer.fax)
				ret += '<p>传真：' + dealer.fax  + '</p>';
			if (dealer.address)
				ret += '<p>地址：' + dealer.address  + '</p>';
			if (dealer.website)
				ret += '<p>地址：<a href="' + dealer.website +'" target="_blank">' + dealer.website  + '</a></p>';
			return ret;
		},

		_get_province_index: function(pid) {
			return $('#dealer-province option[value=' + pid + ']').index();
		},

		show_province: function(province) {
			var self = this;
			province = encodeURIComponent(province);
			$.getJSON("/sales/dealer/province/" + province + "/", function(data) {
				self.$province.val(self._get_province_index(data.id) + 1);
				self.set_cities(data.cities);
				self.set_dealers(data.dealers, PROVINCE);
			});
		},

		show_city: function(city) {
		}
	};

	window.Map = Map;
	window.DealerMap = DealerMap;
});
