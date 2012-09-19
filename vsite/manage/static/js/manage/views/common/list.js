define(function(require, exports, modlue) {
	var ModelView = require('../model');

	var ListView = ModelView.extend({
		view: "list",

		get_load_url: function() {
			return this.get_list_url();
		},

		_render: function(model) {
			this._parse_pagination(model);
			console.log(model.pages);
			this.render_template(model, "left", "#main-left",
				{model: model},
				_.bind(this.left_part_event, this)
			);
		},

		_parse_pagination: function(model) {
			var paginator = model.paginator;
			var num_pages = paginator.num_pages;
			var number = paginator.number
			var size = 10;
			var after = num_pages - number;
			var pages = [];
			var min, max;
			if (num_pages <= size) {
				min = 1;
				max = num_pages;
			} else if (number < 5) {
				min = 1;
				max = size;
			} else if (after < 5) {
				min = num_pages - size + 1;
				max = num_pages;
			} else {
				min = number - 4;
				max = number + 5;
			}
			for (var i = min; i <= max; i++)
				pages.push(i);
			model.pages = pages;
		},

		_tune_name_intro: function() {
			$(".name-intro").each(function() {
				$this = $(this);
				parent = $(this).parent();
				$this.width(parent.width() - 39 - 10);
			});
		},

		left_part_event: function(model) {
			this._tune_name_intro();
			$(".fileviewer tr").hover(function() {
				$(this).addClass("file-row-hovered");
			}, function() {
				$(this).removeClass("file-row-hovered");
			});
			$("#delete-items").click(_.bind(this.on_delete_items, this));
			$(".delete-item").click(_.bind(this.on_delete_item, this));
			$(".select-all").click(_.bind(this.select_all, this));
			$(".select-item").click(_.bind(this.select_item, this));
			$("#refresh-items").click(app.refresh);
		},

		select_all: function(evt) {
			var elem = $(evt.currentTarget);
			if (elem.attr("checked")) {
				$(".select-item, .select-all").attr("checked", true);
			} else {
				$(".select-item, .select-all").removeAttr("checked");
			}
		},

		select_item: function(evt) {
			var elem = $(evt.currentTarget);
			if (!elem.attr("checked")) {
				$(".select-all").removeAttr("checked");
			}
		},

		get_selected_ids: function() {
			var ids = [];
			$(".select-item").each(function(elem) {
				var $elem = $(this);
				if ($elem.attr("checked"))
					ids.push($elem.attr("model-id"));
			});
			return ids;
		},

		on_delete_item: function(evt) {
			var id = $(evt.currentTarget).attr("model-id");
			this.delete_items([id]);
			return false;
		},

		on_delete_items: function(evt) {
			this.delete_items(this.get_selected_ids());
			return false;
		},

		delete_items: function(ids) {
			var self = this;
			art.dialog.confirm('Are you sure delete these items', function() {
				self.send_delete_request(ids);
			});
		},

		send_delete_request: function(ids) {
			app.info("Delete Data...");
			$.ajax(this.get_delete_url(), {
				type: "POST",
				data: {
					csrfmiddlewaretoken: this.model.get("csrf_token"),
					ids: ids
				},
				dataType: "json",
				error: _.bind(this.on_http_error, this),
				success: _.bind(this.on_delete_success, this)
			});
		},

		on_delete_success: function(data) {
			app.success(data.msg);
			app.refresh();
		}
	});

	return ListView;
});

