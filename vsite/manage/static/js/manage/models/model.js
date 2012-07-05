define(['underscore', 'backbone'], function(_, Backbone) {

	var Model = Backbone.Model.extend({
		defaults: {
			type: "TextField"
		},

		initialize: function() {
			if (!this.get("type")) {
				this.set({"type": this.defaults.type});
			}
		},

		clear: function() {
			this.destroy();
		}
	});

	return Model;
});
