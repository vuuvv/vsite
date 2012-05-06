from django.db import models
from django.utils.translation import ugettext_lazy as _

from mptt.models import MPTTModel, TreeForeignKey

from vsite.core.models import Publishable

class Page(MPTTModel, Publishable):
	parent = TreeForeignKey('self', null=True, blank=True, related_name='children')

	class Meta:
		verbose_name = _("Pages")
		verbose_name_plural = _("Pages")
		ordering = ("title",)

	def __unicode__(self):
		return self.title

