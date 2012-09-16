from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.sites.models import Site
from django.utils import timezone

from vsite.users.models import User
from vsite.core.fields import RichTextField
from vsite.core.models import MetaData

class Article(models.Model):
	site = models.ForeignKey(Site, related_name="articles", verbose_name=_("Site"))
	user = models.ForeignKey(User, related_name="articles", verbose_name=_("User"))
	title = models.CharField(_("Title"), max_length=100)
	sub_title = models.CharField(_("Sub Title"), max_length=100)
	_from = models.CharField(_("From"), max_length=100)
	author = models.CharField(_("Author"), max_length=50)
	is_draft = models.BooleanField(_("Is Draft"), default=True)
	content = RichTextField(_("Content"))
	date_created = models.DateTimeField(_('Date Created'), default=timezone.now)

from vsite.manage.sites import site, ModelManage

class ArticleManage(ModelManage):
	label = _("Article")
	fields = ("site", "title", "sub_title", "author", "_from", "content")
	list_display = ("title", "author", "date_created")
	readonly_fields = ()

site.register(Article, ArticleManage)

