define(function(require, exports, module) {
	var widgets = require('manage/views/widgets'),
		ModelView = require('manage/views/model'),
		config = require('manage/config');

	require('kindeditor');

	var EditView = ModelView.extend({
		view: "edit",

		get_load_url: function() {
			var type = this.options.type;
			if (type == "add")
				return this.get_add_url();
			else if (type == "update")
				return this.get_update_url();
			throw "wrong operate type";
		},

		_render: function(model) {
			this.prepare_fields(model);
			this.render_template(model, "left", "#main-left",
				{model: model, type: this.options.type},
				_.bind(this.left_part_event, this)
			);
		},

		left_part_event: function() {
			//$("textarea.xheditor").xheditor({
			//	upImgUrl:'/files/upload/'
			//});
			if ($('textarea.xheditor').length > 0) {
				KindEditor.lang({
					uploadfile: "uploadfile"
				});
				KindEditor.plugin('uploadfile', function(K) {
					var self = this, name = 'uploadfile';
					self.clickToolbar(name, function() {
						app.file_manage();
					});
				});
				KindEditor.create('textarea.xheditor', {
					afterCreate: function() {
						$(this.srcElement).data("editor", this);
					},
					items: [
						'source', '|', 'undo', 'redo', '|', 
						'cut', 'copy', 'paste', 'plainpaste', 'wordpaste', '|', 
						'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
						'superscript', 'clearhtml', 'quickformat', 'selectall', '/',
						'formatblock', 'fontname', 'fontsize', '|', 
						'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 
						'image', 'flash', 'media', 'uploadfile', 'table', 'hr', 'anchor', 'link', 'unlink'
					]
				});
			}
			$("#main-form-submit").click(_.bind(this.on_submit, this));
		},

		prepare_fields: function(model) {
			var fields = model.fields,
				module_name = model.module_name,
				app_label = model.app_label;

			for (var i = 0; i < fields.length; i++) {
				var field = fields[i];
				if (field.name == "parent" && this.options.type == "add" && !_.isUndefined(this.options.pid)) {
					field.value = this.options.pid;
				}
				var widget = new widgets[field.widget]({
					app_label: app_label,
					module_name: module_name,
					type: this.options.type,
					field: field
				});
				field.html = widget.render();
			}
		},

		get_form_data: function() {
			var inputs = $("#main-form").find("select, input, textarea"),
				data = {
					csrfmiddlewaretoken: this.model.get("csrf_token")
				};

			inputs.each(function(index, elem) {
				if (!elem.readOnly) {
					var editor = $(elem).data("editor");
					if (editor)
						editor.sync();
					data[elem.name] = elem.value;
				}
			});
			return data;
		},

		on_submit: function() {
			app.info("Saving...");
			var now = new Date;
			$.ajax(this.get_load_url(), {
				type: "POST",
				data: this.get_form_data(),
				dataType: "json",
				error: _.bind(this.on_http_error, this),
				success: _.bind(this.on_success, this)
			});
		},

		on_success: function(data) {
			if (data.status == "error")
				app.error(data.msg, true);
			else {
				app.success(data.msg, true);
				if (this.options.type == "add") {
					app.navigate(data.app_label + "/" + data.module_name + "/" + data.id, {trigger: true});
					return;
				} else {
					this.model.set("fields", data.fields);
					this._render(this.model.toJSON());
				}
			}
		}
	});

	return EditView;
});


