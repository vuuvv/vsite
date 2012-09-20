from datetime import datetime
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.sites.models import Site

from mptt.models import MPTTModel, TreeForeignKey

from vsite.core.fields import RichTextField, ImageField
from vsite.core.models import MetaData

class Category(MPTTModel):
	site = models.ForeignKey(Site, related_name="categories", verbose_name=_("Site"))
	name = models.CharField(_("Name"), max_length=100)
	slug = models.CharField(_("Slug"), max_length=100, blank=True, null=True)
	description = models.TextField(_("Description"), blank=True)
	image = ImageField(_("Image"), blank=True)
	parent = TreeForeignKey('self', null=True, blank=True, verbose_name='children')
	meta_keywords = models.TextField(_("Meta keywords"), blank=True)
	meta_description = models.TextField(_("Meta description"), blank=True)
	active = models.BooleanField(_("Active"), default=True)

	class Meta:
		verbose_name = _("Category")
		verbose_name_plural = _("Categories")

	def __unicode__(self):
		return self.name

	def save(self, *args, **kwargs):
		if self.slug is None:
			self.slug = self.name
		super(Category, self).save(*args, **kwargs)

	@models.permalink
	def get_absolute_url(self):
		return ('product_category', (self.slug,), {})

class Product(MetaData):
	categories = models.ManyToManyField(Category, verbose_name=_("Category"), related_name="products")
	name = models.CharField(_("Name"), max_length=50)
	slug = models.SlugField(_("Slug"), unique=True)
	image = ImageField(_("Image"), blank=True)
	thumbnail = ImageField(_("Thumbnail"), blank=True)
	ordering = models.IntegerField(_("Ordering"), default=1000)

	tags = models.CharField(_("Slug"), max_length=100)
	active = models.BooleanField(_("Active"), default=True)
	creation_date = models.DateTimeField(_("Creation date"), auto_now_add=True)

	class Meta:
		verbose_name = _("Product")
		verbose_name_plural = _("Product")
		ordering = ("ordering",)

	def __unicode__(self):
		return self.name

	@property
	def tag_list(self):
		return [t.strip() for t in self.tags.split(",")]

	@models.permalink
	def get_absolute_url(self):
		return ('product_article', (self.id,), {})

