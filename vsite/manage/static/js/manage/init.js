
seajs.config({
	alias: {
		text: 'libs/seajs/1.1.9/plugin-text',
		kindeditor: 'libs/kindeditor/kindeditor',
		swfupload: 'libs/swfupload/swfupload',
		swfupload_queue: 'libs/swfupload/plugins/swfupload.queue'
	},
	debug: true,
	map: [
		//[ /^(.*\.(?:css|js))(.*)$/i, '$1?' + (new Date).getTime() ]
	],
	base: 'http://localhost:8000/static/js/'
});

define(function(require) {
	require('text');
	require("manage/main");
});

