import os
from datetime import datetime

from wand.image import Image

from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.sites.models import Site

from mptt.models import MPTTModel, TreeForeignKey

from vsite.core.fields import RichTextField
from vsite.core.models import MetaData


PRODUCT_ROOT = settings.UPLOAD_ROOT + 'product/'
PRODUCT_THUMB_ROOT = PRODUCT_ROOT + 'thumb/'
PRODUCT_CATEGORY_ROOT = PRODUCT_ROOT + 'category/'
PRODUCT_TECHNOLOGY_ROOT = PRODUCT_ROOT + 'technology/'

def make_thumb(path, width=160, height=120):
	img = Image(filename=path).clone()
	w, h= img.width, img.height

	if w > width or h > height:
		img.resize(width, height)
	return img

class Category(MPTTModel):
	site = models.ForeignKey(Site, related_name="categories", verbose_name=_("Site"))
	name = models.CharField(_("Name"), max_length=100)
	slug = models.CharField(_("Slug"), max_length=100, blank=True, null=True)
	description = models.TextField(_("Description"), blank=True)
	image = models.ImageField(_("Image"), blank=True, upload_to=PRODUCT_CATEGORY_ROOT)
	parent = TreeForeignKey('self', null=True, blank=True, verbose_name=_('Parent'))
	meta_keywords = models.TextField(_("Meta keywords"), blank=True)
	meta_description = models.TextField(_("Meta description"), blank=True)
	active = models.BooleanField(_("Active"), default=True)

	class Meta:
		verbose_name = _("Category")
		verbose_name_plural = _("Categories")

	def __unicode__(self):
		return self.name

	def __str__(self):
		return self.name

	def save(self, *args, **kwargs):
		if self.slug is None:
			self.slug = self.name
		super(Category, self).save(*args, **kwargs)

	@models.permalink
	def get_absolute_url(self):
		return ('product_category', (self.slug,), {})

class Technology(models.Model):
	name = models.CharField(_("Name"), max_length=50)
	description = models.TextField(_("Description"), blank=True)
	image = models.ImageField(_("Image"), blank=True, upload_to=PRODUCT_TECHNOLOGY_ROOT)

	def __unicode__(self):
		return self.name

class Product(MetaData):
	categories = models.ManyToManyField(Category, verbose_name=_("Category"), related_name="products")
	sku = models.CharField(_("sku"), max_length=50)
	name = models.CharField(_("Name"), max_length=50, blank=True)
	slug = models.SlugField(_("Slug"), unique=True, blank=True)
	image = models.ImageField(_("Image"), upload_to=PRODUCT_ROOT, blank=True)
	thumbnail = models.ImageField(_("Thumbnail"), upload_to=PRODUCT_THUMB_ROOT, blank=True)

	summary = RichTextField(_("Summary"))
	assembly = RichTextField(_("Assembly"), blank=True)
	manual = RichTextField(_("Manual"), blank=True)
	technologies = models.ManyToManyField(Technology, verbose_name=_("Technology"), related_name="products")

	ordering = models.IntegerField(_("Ordering"), default=1000)

	tags = models.CharField(_("Tags"), max_length=100, blank=True)
	active = models.BooleanField(_("Active"), default=True)
	creation_date = models.DateTimeField(_("Creation date"), auto_now_add=True)

	class Meta:
		verbose_name = _("Product")
		verbose_name_plural = _("Product")
		ordering = ("ordering",)

	def __unicode__(self):
		return self.name

	def save(self, *arg, **kwargs):
		if not self.name:
			self.name = self.sku
		if not self.slug:
			self.slug = self.sku
		self.slug = self.slug.upper
		# handle thumb
		super(Product, self).save(*arg, **kwargs)
		if self.image:
			basename = os.path.basename(self.image.path)
			img = make_thumb(os.path.join(settings.MEDIA_ROOT, self.image.name), 215, 143)
			path = os.path.join(settings.MEDIA_ROOT, PRODUCT_THUMB_ROOT, basename)
			img.save(filename=path)
			self.thumbnail = PRODUCT_THUMB_ROOT + basename
			super(Product, self).save(*arg, **kwargs)

	def get_categories(self):
		return self.categories.all()

	@property
	def tag_list(self):
		return [t.strip() for t in self.tags.split(",")]

	@models.permalink
	def get_absolute_url(self):
		return ('product_detail', (self.slug,), {})

class PropertyKey(models.Model):
	name = models.CharField(_("Name"), max_length=50)
	description = models.TextField(_("Description"), blank=True)

	class Meta:
		ordering = ("name",)

	def __unicode__(self):
		return u"%s" % self.name

class Property(models.Model):
	product = models.ForeignKey(Product, verbose_name=_("Product"), related_name="properties")
	key = models.ForeignKey(PropertyKey, verbose_name=_("Property Key"), related_name="properties")
	value = models.CharField(_("Value"), max_length=50)
	description = models.TextField(_("Description"), blank=True)

	class Meta:
		verbose_name = _("Property")
		verbose_name_plural = _("properties")
		ordering = ("key__name",)

	def __unicode__(self):
		return u"%s:%s" % (self.key, self.value)

