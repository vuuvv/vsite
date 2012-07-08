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

p.tmpl = '<input id="<%= app_label %>-<%= module_name%>-<%= name %>" type="text" name="<%= name %>" class="text" <% if(readonly) { %>readonly<% } %>/>';

Fields.CharField = CharField;

/* </CharField> */

/* <TreeNodeChoiceField> */
var TreeNodeChoiceField = function(options) {
	this.options = options;
};

p = TreeNodeChoiceField.prototype = {
	html: function() {
		var opts = this.options;
		var t = _.template(this.tmpl)
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

p.tmpl = '<select id="<%= app_label %>-<%= module_name%>-<%= name %>" class="select" name="<%= name %>"> <option value=""></option> <% _.each(choices, function(choice){ %> <option value="<%= choice.id %>"><%= choice.title %></option> <% }) %> </select>';

Fields.TreeNodeChoiceField = TreeNodeChoiceField;
/* </TreeNodeChoiceField> */


return Fields;

});



