define([
	'underscore',
	'backbone',
	'models/field'
], function(_, Backbone, Field) {
	var FieldsCollection = Backbone.Collection.extend({
		model: Field,
		url: "api/fields/test"
	});

	return FieldsCollection;

});

