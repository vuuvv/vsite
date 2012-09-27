from datetime import datetime

from django.db import models
from django.utils.translation import ugettext_lazy as _

from vsite.core.fields import RichTextField

class Job(models.Model):
	name = models.CharField(_("Job Name"), max_length=50)
	experience = models.CharField(_("Job Experience"), max_length=50, blank=True)
	education = models.CharField(_("Education"), max_length=50, blank=True)
	professional = models.CharField(_("Professional"), max_length=50, blank=True)
	age = models.CharField(_("Age"), max_length=50, blank=True)
	gender = models.CharField(_("Gender"), max_length=10, blank=True)
	description = RichTextField(_("Description"), blank=True)
	publish_date = models.DateField(_("Publish Date"), blank=True)
	expired_date = models.DateField(_("Expired Date"), blank=True, null=True)

	class Meta:
		ordering = ("-publish_date",)

	def __unicode__(self):
		return self.name

	def save(self, *args, **kwargs):
		if not self.publish_date:
			self.publish_date = datetime.now()
		super(Job, self).save(*args, **kwargs)

