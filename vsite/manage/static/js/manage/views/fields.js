define([
	'jquery',
	'underscore',
	'backbone',
], function($, _, Backbone) {

var Fields = {};

/* <CharField> */


var CharField = function(options) {
	this.options = options;
};

var p = CharField.prototype = {
	html: function() {
		var opts = this.options;
		var t = _.template(this.tmpl)
		return t(opts);
	}
};

p.tmpl = '<input id="<%= app_label %>-<%= module_name%>-<%= field.name %>" type="text" name="<%= field.name %>" class="text" <% if(field.readonly) { %>readonly<% } %> <% if(type == "update" && !_.isNull(field.value)) { %> value="<%= field.value %>" <% } %>/>';

Fields.CharField = CharField;

/* </CharField> */

/* <TreeNodeChoiceField> */
var TreeNodeChoiceField = function(options) {
	this.options = options;
};

p = TreeNodeChoiceField.prototype = {
	html: function() {
		var opts = this.options;
			t = _.template(this.tmpl)
		return t(opts);
	}
};

/*
<select>
	<option value=""><option>
	<% _.each(choices, function(choice){ %>
		<option value="<%= choice.id %>><%= choice.title %></option>
	<% } %>
</select>
*/

p.tmpl = '<select id="<%=app_label%>-<%=module_name%>-<%=field.name%>" class="select" name="<%= field.name %>"> <option value=""></option> <% _.each(field.choices, function(choice){ %> <option value="<%= choice.id %>" <% if (type == "update" && field.value == choice.id) { %><% } %>><%= choice.title %></option> <% }) %> </select>';

Fields.TreeNodeChoiceField = TreeNodeChoiceField;
/* </TreeNodeChoiceField> */

return Fields;

});




