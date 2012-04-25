from django.db import models
from django.utils.translation import ugettext_lazy as _

from django.contrib.sites.models import Site
from django.contrib.sites.CurrentSiteManager import CurrentSiteManager

class Slugged(models.Model):
	title = models.CharField(_("Title"), max_length=100)
	slug = models.CharField(_("URL"), max_length=100, blank=True, null=True)
	site = models.ForeignKey(Site, editable=False)

	objects = CurrentSiteManager()

	class Meta:
		abstract = True
		ordering = ("title",)

	def __unicode__(self):
		return self.title

	def save(self, update_site=False, *args, **kwargs):
		if not self.slug:
			pass
