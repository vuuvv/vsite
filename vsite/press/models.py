from datetime import datetime
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.sites.models import Site

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

class Press(MetaData):
	user = models.ForeignKey(User, related_name="press", verbose_name=_("User"), null=True, blank=True)
	title = models.CharField(_("Title"), max_length=100)
	category = models.ForeignKey(PressCategory, related_name="press", verbose_name=_("Category"))
	sub_title = models.CharField(_("Sub Title"), null=True, blank=True, max_length=100)
	author = models.CharField(_("Author"), null=True, blank=True, max_length=50)
	press_from = models.TextField(_("From"), null=True, blank=True, max_length=200)
	summary = models.CharField(_("Summary"), null=True, blank=True, max_length=100)
	content = RichTextField(_("Content"), null=True, blank=True)
	publish_date = models.DateTimeField(_("Published from"),
		help_text=_("With published checked, won't be shown until this time"),
			  blank=True, null=True)
	is_active = models.BooleanField(_("Is Active"), default=True)
	tags = models.CharField(_("Tags"), null=True, blank=True, max_length=50)
	thumbnail = ImageField(_("Thumbnail"), null=True, blank=True)

	class Meta:
		verbose_name = _("Press")
		verbose_name_plural = _("Press")
		ordering = ('publish_date', )

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
	list_display = ("title", "category", "is_active", "publish_date")
	readonly_fields = ()

site.register(Press, PressManage)

