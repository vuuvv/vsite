(function() {
	var existed = false;
	var pbox = $('<div class="preview-box" style="display:none;z-index:11;"><div class="preview-container"><a href="javascript:;" data-btn="focus" style="position:absolute; top:-99999px;">Focus</a><div class="preview-close"  btn="close" data_title="ESC关闭"><b>关闭</b></div><div class="preview-panel"><ul class="contents-control" rel="img_ctl" style="display:none;"><li size="100"><i class="sz-01"></i><b>小图</b></li><li size="480"><i class="sz-02"></i><b>中图</b></li><li size="800"><i class="sz-03"></i><b>大图</b></li><li size="1440"><i class="sz-04"></i><b>特大图</b></li><li btn="fullscreen"><i class="sz-04"></i><b>原始图</b></li></ul><ul class="contents-panel" rel="img_ctl"><li btn="rotate"><i class="pr-rotate"></i><b>旋转</b></li></ul><ul class="contents-panel" vod="1"><li btn="min_size"><i class="pr-pack"></i><b>最小化</b></li><li btn="max_size"><i class="pr-fullscreen"></i><b>最大化</b></li></ul></div><div class="preview-contents" rel="con"><div class="pr-btn-switch"><b class="pr-btn-prev" btn="prev" data_title="按键盘“←”键上一个">上一个</b><b class="pr-btn-next" btn="next" data_title="按键盘“→”键下一个">下一个</b></div><div class="previewer-loading" style="display:none;" rel="loading">载入中...</div></div></div><div class="preview-info"><h3 class="pri-title"><i class="pr-info"></i>文件信息</h3><div class="pri-info"><p rel="file_name" style="display:none;"></p><p rel="file_size" style="display:none;"></p></div><div class="pri-ban" rel="ban" style="width:200px; display:none;"></div><div class="pri-opt"><ul rel="btn_hand"><li btn="collect"><i class="pr-save"></i><span>转存</span></li><li btn="star"><i class="pr-star"></i><span>星标</span></li><li btn="download"><i class="pr-download"></i><span>下载</span></li><li btn="share"><i class="pr-share"></i><span>分享</span></li></ul></div><div class="pri-desc" rel="desc" style="display:none;"></div></div></div>');

	var PreviewBox = function() {
		if (!existed) {
			$("body").append(pbox);
			existed = true;
		}
	};

	PreviewBox.prototype = {
		show: function() {
			pbox.show();
		},

		hide: function() {
			pbox.hide();
		}
	};

	$(function() {
		$(".slide-desc").click(function() {
			var preview = new PreviewBox();
			preview.show();
		});
	});
}());
