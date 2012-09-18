define(function(require) {
	var config = require('manage/config'),
		EditView = require('manage/views/common/edit');

	var ArticleEditView = EditView.extend({
		left_part_event: function() {
			var self = this;
			EditView.prototype.left_part_event.apply(this);
			$("#article-publish").click(function() {
				self.publish();
			});
		},

		publish: function() {
			art.dialog({
				title: "发布选项"
			}).show();
		}
	});

	return ArticleEditView;
});
