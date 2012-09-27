import os

from datetime import datetime
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.sites.models import Site
from django.conf import settings

from vsite.core.fields import RichTextField, ImageField
from vsite.core.models import MetaData
from vsite.document.models import Article
from vsite.users.models import User

class PressCategory(models.Model):
	site = models.ForeignKey(Site, related_name="press_categories", verbose_name=_("Site"))
	name=models.CharField(_("Name"), max_length=100)
	slug=models.CharField(_("Slug"), max_length=100, blank=True, null=True)

	def save(self, *args, **kwargs):
		if self.slug is None:
			self.slug = self.name
		super(PressCategory, self).save(*args, **kwargs)

	def __unicode__(self):
		return self.name

	@models.permalink
	def get_absolute_url(self):
		return ('press_category', (self.slug,), {})

def get_press_image_path(model, filename):
	return "upload/press/%s/%s" % (model.id, filename)

class Press(MetaData):
	user = models.ForeignKey(User, related_name="press", verbose_name=_("User"), null=True, blank=True)
	title = models.CharField(_("Title"), max_length=100)
	category = models.ForeignKey(PressCategory, related_name="press", verbose_name=_("Category"))
	sub_title = models.CharField(_("Sub Title"), null=True, blank=True, max_length=100)
	author = models.CharField(_("Author"), null=True, blank=True, max_length=50)
	press_from = models.CharField(_("From"), null=True, blank=True, max_length=200)
	summary = models.TextField(_("Summary"), null=True, blank=True, max_length=100)
	content = RichTextField(_("Content"), null=True, blank=True)
	publish_date = models.DateTimeField(_("Published from"),
		help_text=_("With published checked, won't be shown until this time"),
			  blank=True, null=True)
	is_active = models.BooleanField(_("Is Active"), default=True)
	tags = models.CharField(_("Tags"), null=True, blank=True, max_length=50)
	thumbnail = models.ImageField(_("Thumbnail"), upload_to=get_press_image_path, null=True, blank=True)

	class Meta:
		verbose_name = _("Press")
		verbose_name_plural = _("Press")
		ordering = ('-publish_date', )

	def __unicode__(self):
		return self.title

	@property
	def tag_list(self):
		return [t.strip() for t in self.tags.split(",")]

	def save(self, *args, **kwargs):
		if self.publish_date is None:
			self.publish_date = datetime.now()
		super(Press, self).save(*args, **kwargs)

	@models.permalink
	def get_absolute_url(self):
		return ('press_article', (self.id,), {})

def get_magzine_image_path(model, filename):
	name, ext = os.path.splitext(filename)
	return "upload/magzine/%s/%03d.%s" % (model.magzine.slug, model.page, ext)

def get_magzine_thumb_path(model, filename):
	name, ext = os.path.splitext(filename)
	return "upload/magzine/%s/thumb%s" % (model.slug, ext)

class MagzineYear(models.Model):
	year = models.IntegerField(_("Year"))

	class Meta:
		ordering = ("-year", )

	def __unicode__(self):
		return u"%s" % self.year

class Magzine(MetaData):
	year = models.ForeignKey(MagzineYear, verbose_name=_("Year"), related_name="magzines")
	name = models.CharField(_("Magzine"), max_length=50)
	slug = models.CharField(_("Slug"), max_length=50)
	ordering = models.IntegerField(_("Ordering"), blank=True)
	active = models.BooleanField(_("Active"), default=True)
	thumbnail = models.ImageField(_("Thumbnail"), upload_to=get_magzine_thumb_path, blank=True)

	class Meta:
		ordering = ("slug", )

	def __unicode__(self):
		return self.name

	@property
	def swf_url(self):
		return "%supload/magzine/magzine.swf?xml=%s/pages.xml" % (settings.MEDIA_URL, self.slug)

class MagzineImage(models.Model):
	page = models.IntegerField(_("Page"), blank=True)
	image = models.ImageField(_("Image"), upload_to=get_magzine_image_path)
	magzine = models.ForeignKey(Magzine, verbose_name=_("Magzine"), related_name="images")

	class Meta:
		ordering = ("page", )

	def __unicode__(self):
		return self.image.url

	def save(self, *args, **kwargs):
		basename = os.path.basename(self.image.path)
		if not self.page:
			self.page = os.path.split(basename)[0]

		super(MagzineImage, self).save(*args, **kwargs)

from vsite.manage.sites import site, ModelManage

class PressCategoryManage(ModelManage):
	label = _("PressCategory")
	title = "name"
	fields = ("name", "site", "slug")
	list_display = ("name", "site", "slug")
	readonly_fields = ()

site.register(PressCategory, PressCategoryManage)

class PressManage(ModelManage):
	label = _("Press")
	title = "title"
	fields = ("title", "sub_title", "author", "press_from", "category", "is_active", "publish_date", "summary", "content", "tags", "thumbnail")
	list_display = ("title", "category", "publish_date")
	readonly_fields = ()

site.register(Press, PressManage)

