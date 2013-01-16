from django.db import models
from django.conf import settings
from vsite.core.widgets import Editor, Image

from vsite.rte.kindeditor.widgets import KindEditor

class RichTextField(models.TextField):
    def formfield(self, **kwargs):
        widget_class = KindEditor
        kwargs["widget"] = widget_class()
        formfield = super(RichTextField, self).formfield(**kwargs)
        return formfield

class ImageField(models.CharField):
    def __init__(self, *args, **kwargs):
        defaults = {"max_length": 256}
        defaults.update(kwargs)
        super(ImageField, self).__init__(*args, **defaults)

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
