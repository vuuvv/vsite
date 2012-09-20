from django.forms.widgets import Widget, Textarea, TextInput
from django.template.loader import render_to_string

from vsite.rte.kindeditor.widgets import KindEditor

class Editor(KindEditor):
	pass

class Image(TextInput):
	pass
