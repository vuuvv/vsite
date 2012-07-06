import re
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.sites.models import Site

from mptt.models import MPTTModel, TreeForeignKey

from vsite.core.models import Publishable

class URL(MPTTModel):
	title = models.CharField(_("Title"), max_length=100)
	slug = models.CharField(_('URL'), max_length=255, blank=True, null=True)
	parent = TreeForeignKey('self', null=True, blank=True, related_name='children')

	class Meta:
		verbose_name = _("URL")
		verbose_name_plural = _("URL")
		ordering = ("slug",)

	def __unicode__(self):
		return self.slug

	def save(self):
		if not self.slug:
			title = re.sub("[-\s]+", "-", self.title.lower())
			if self.is_root_node():
				slug = title
			else:
				slug = "%s/%s" % (self.parent.slug, title)
			self.slug = slug
		super(URL, self).save()

class Page(Publishable):
	title = models.CharField(_("Title"), max_length=100)
	url = TreeForeignKey(URL, related_name="pages")
	site = models.ForeignKey(Site, related_name="pages")

	class Meta:
		verbose_name = _("Pages")
		verbose_name_plural = _("Pages")
		ordering = ("title",)

	def __unicode__(self):
		return self.title


from vsite.manage.sites import site
site.register(URL)
site.register(Page)

