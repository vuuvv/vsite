from datetime import datetime

from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.sites.models import Site
from django.utils import timezone

from vsite.users.models import User
from vsite.core.fields import RichTextField
from vsite.core.models import MetaData

class Article(MetaData):
	user = models.ForeignKey(User, related_name="articles", verbose_name=_("User"), null=True, blank=True)
	title = models.CharField(_("Title"), max_length=100)
	sub_title = models.CharField(_("Sub Title"), null=True, blank=True, max_length=100)
	_from = models.CharField(_("From"), null=True, blank=True, max_length=100)
	author = models.CharField(_("Author"), null=True, blank=True, max_length=50)
	is_draft = models.BooleanField(_("Is Draft"), default=True)
	content = RichTextField(_("Content"))
	date_created = models.DateTimeField(_('Date Created'), blank=True, null=True)

	def save(self, *args, **kwargs):
		if self.date_created is None:
			self.date_created = datetime.now()
		super(Article, self).save(*args, **kwargs)


from vsite.manage.sites import site, ModelManage

class ArticleManage(ModelManage):
	label = _("Article")
	fields = ("title", "date_created", "sub_title", "author", "_from", "content")
	list_display = ("title", "author", "date_created")
	readonly_fields = ()

site.register(Article, ArticleManage)

