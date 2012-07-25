define(function(require) {
var Widgets = {};

var Widget = function() {};

Widget.prototype = {
	render: function() {
		var opts = this.options;
		var t = _.template(this.tmpl)
		return t(opts);
	}
};

/* <TextInput> */

var TextInput = function(options) {
	this.options = options;
};

var p = TextInput.prototype = new Widget;

p.tmpl = '<input field="<%= field.type %>" id="<%= app_label %>-<%= module_name%>-<%= field.name %>" type="text" name="<%= field.name %>" class="text input-xxlarge" <% if(field.readonly) { %>readonly<% } %> <% if(type == "update" && !_.isNull(field.value)) { %> value="<%= field.value %>" <% } %>/>';

Widgets.TextInput = TextInput;
Widgets.DateTimeInput = TextInput;
Widgets.CheckboxInput = TextInput;
Widgets.BooleanField = TextInput;

/* </TextInput> */

/* <Textarea> */
var Textarea = function(options) {
	this.options = options;
};
var p = Textarea.prototype = new Widget;
p.tmpl = '<textarea name="<%= field.name %>" class="text input-xxlarge"><% if(!_.isUndefined(field.value)) { %><%= field.value %><% } %></textarea>';
Widgets.Textarea = Textarea;
/* </Textarea> */

/* <RichTextarea> */
var Editor = function(options) {
	this.options = options;
};
var p = Editor.prototype = new Widget;
p.tmpl = '<textarea name="<%= field.name %>" class="editor text input-xxlarge"><% if(!_.isUndefined(field.value)) { %><%= field.value %><% } %></textarea>';
Widgets.Editor = Editor;
/* </RichTextarea> */


/* <Select> */
var Select = function(options) {
	this.options = options;
};

p = Select.prototype = new Widget;

/*
<select id="<%=app_label%>-<%=module_name%>-<%=field.name%>" class="select" name="<%= field.name %>"> 
	<option value=""></option> 
	<% _.each(field.choices, function(choice){ %> 
		<option value="<%= choice.id %>" <% if (!_.isUndefined(field.value) && field.value == choice.id) { %>selected<% } %>><%= choice.title %></option> 
	<% }) %> 
</select>;
*/
p.tmpl = '<select id="<%=app_label%>-<%=module_name%>-<%=field.name%>" class="select input-xxlarge" name="<%= field.name %>"> <option value=""></option> <% _.each(field.choices, function(choice){ %> <option value="<%= choice.id %>" <% if (!_.isUndefined(field.value) && field.value == choice.id) { %>selected<% } %>><%= choice.title %></option> <% }) %> </select>';

Widgets.Select = Select;

/* </Select> */

return Widgets;

});




