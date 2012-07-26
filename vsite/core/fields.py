from django.db import models
from django.conf import settings
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

if "south" in settings.INSTALLED_APPS:
	try:
		from south.modelsinspector import add_introspection_rules
		add_introspection_rules([], ["^vsite\.core\.fields\."])
	except ImportError:
		pass
