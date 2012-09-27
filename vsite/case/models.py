from datetime import datetime

from django.db import models
from django.utils.translation import ugettext_lazy as _

class Category(models.Model):
	name = models.CharField(_("Name"), max_length=50)
	slug = models.CharField(_("Slug"), max_length=50)

	def __unicode__(self):
		return self.name

class Case(models.Model):
	category = models.ForeignKey(Category, verbose_name=_("Category"), related_name="cases")
	name = models.CharField(_("Name"), max_length=50)
	description = models.TextField(_("Description"), blank=True)
	image = models.ImageField(_("Image"), upload_to="upload/case/", blank=True)
	create_date = models.DateField(_("Date"), blank=True)

	def __unicode__(self):
		return self.name

	def save(self, *args, **kwargs):
		if not self.create_date:
			self.create_date = datetime.now()
		super(Case, self).save(*args, **kwargs)

