from datetime import datetime

from django.db import models
from django.utils.translation import ugettext_lazy as _

from django.contrib.sites.models import Site
from django.contrib.sites.managers import CurrentSiteManager

class Slugged(models.Model):
	title = models.CharField(_("Title"), max_length=100)
	slug = models.CharField(_("URL"), max_length=100, blank=True, null=True)
	site = models.ForeignKey(Site, editable=False)

	#objects = CurrentSiteManager()

	class Meta:
		abstract = True
		ordering = ("title",)

	def __unicode__(self):
		return self.title

	def save(self, update_site=False, *args, **kwargs):
		#if not self.slug:
		#	pass

		if update_site or not self.id:
			self.site = Site.objects.get_current()
		super(Slugged, self).save(*args, **kwargs)

class MetaData(models.Model):
	description = models.TextField(_("Description"), blank=True)
	gen_description = models.BooleanField(_("Generate description"),
		help_text=_("If checked, the description will be automatically "
			  "generated from content. Uncheck if you want to manually "
			  "set a custom description."), default=True)
	keywords = models.TextField(verbose_name=_("Keywords"))

	class Meta:
		abstract = True

CONTENT_STATUS_DRAFT = 1
CONTENT_STATUS_PUBLISHED = 2
CONTENT_STATUS_CHOICES = (
	(CONTENT_STATUS_DRAFT, _("Draft")),
	(CONTENT_STATUS_PUBLISHED, _("Published")),
)

class Publishable(Slugged, MetaData):
	status = models.IntegerField(_("Status"),
		choices=CONTENT_STATUS_CHOICES, default=CONTENT_STATUS_PUBLISHED)
	publish_date = models.DateTimeField(_("Published from"),
		help_text=_("With published checked, won't be shown until this time"),
			  blank=True, null=True)
	expiry_date = models.DateTimeField(_("Expires on"),
		help_text=_("With published checked, won't be shown after this time"),
			  blank=True, null=True)
	short_url = models.URLField(blank=True, null=True)

	class Meta:
		abstract = True

	def save(self, *args, **kwargs):
		if self.publish_date is None:
			self.publish_date = datetime.now()
		super(Displayable, self).save(*args, **kwargs)

