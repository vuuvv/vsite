from django.db import models
from django.contrib.admin import options

from vsite.joyou import widgets

options.FORMFIELD_FOR_DBFIELD_DEFAULTS = {
    #models.DateTimeField: {
    #    'form_class': forms.SplitDateTimeField,
    #    'widget': widgets.AdminSplitDateTime
    #},
    #models.DateField:       {'widget': widgets.AdminDateWidget},
    #models.TimeField:       {'widget': widgets.AdminTimeWidget},
    #models.TextField:       {'widget': widgets.AdminTextareaWidget},
    #models.URLField:        {'widget': widgets.AdminURLFieldWidget},
    #models.IntegerField:    {'widget': widgets.AdminIntegerFieldWidget},
    #models.BigIntegerField: {'widget': widgets.AdminIntegerFieldWidget},
    models.CharField:       {'widget': widgets.AdminTextInputWidget},
    #models.ImageField:      {'widget': widgets.AdminFileWidget},
    #models.FileField:       {'widget': widgets.AdminFileWidget},
}
