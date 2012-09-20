from django import forms
from django.conf import settings
from django.utils.safestring import mark_safe
from django.template.loader import render_to_string
from django.template import RequestContext
from django.utils.translation import ugettext_lazy as _

class KindEditor(forms.Textarea):
	class Media:
		css = {
			'all': (  settings.STATIC_URL + 'js/libs/kindeditor/themes/default/default.css',
					settings.STATIC_URL + 'js/libs/kindeditor/plugins/code/prettify.js',),
		}
		js  = (
			"%sjs/libs/kindeditor/kindeditor.js" % settings.STATIC_URL,
			settings.STATIC_URL + 'js/libs/kindeditor/plugins/code/prettify.js',
		)

	def __init__(self, attrs = {}):
		#attrs['style'] = "width:800px;height:400px;visibility:hidden;"
		super(KindEditor, self).__init__(attrs)

	def render(self, name, value, attrs=None):
		rendered = super(KindEditor, self).render(name, value, attrs)
		context = {
			'name': name,
			'STATIC_URL':settings.STATIC_URL,
		}
		return rendered  + mark_safe(render_to_string('editor/kindeditor.html', context))

