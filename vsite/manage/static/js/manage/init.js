_.templateSettings = {
	evaluate    : /{%([\s\S]+?)%}/g,
	interpolate : /{{([\s\S]+?)}}/g,
	escape      : /{{-([\s\S]+?)}}/g
};

seajs.config({
	alias: {
		kindeditor: 'libs/kindeditor/kindeditor',
		swfupload: 'libs/swfupload/swfupload',
		swfupload_queue: 'libs/swfupload/plugins/swfupload.queue'
	},
	preload: ['libs/seajs/1.1.9/plugin-text'],
	debug: true,
	map: [
		//[ /^(.*\.(?:css|js))(.*)$/i, '$1?' + (new Date).getTime() ]
	],
	base: 'http://localhost:8000/static/js/'
}).use('manage/main');

