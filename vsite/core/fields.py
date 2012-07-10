from django.db import models
from vsite.core.widgets import XHEditor

class RichTextField(models.TextField):
	def formfield(self, **kwargs):
		kwargs["widget"] = XHEditor()
		formfield = super(RichTextField, self).formfield(**kwargs)
		return formfield
