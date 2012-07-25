from django.db import models
from vsite.core.widgets import Editor, Image

class RichTextField(models.TextField):
	def formfield(self, **kwargs):
		defaults = {'widget': Editor}
		defaults.update(kwargs)
		return super(RichTextField, self).formfield(**defaults)

class ImageField(models.URLField):
	def formfield(self, **kwargs):
		defaults = {'widget': Image}
		defaults.update(kwargs)
		return super(ImageField, self).formfield(**defaults)
