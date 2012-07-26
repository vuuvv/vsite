import re
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.sites.models import Site
from django.db.transaction import commit_on_success

from mptt.models import MPTTModel, TreeForeignKey

from vsite.core.models import Publishable
from vsite.core.fields import RichTextField

from .managers import PageManager

class Page(MPTTModel, Publishable):
	site = models.ForeignKey(Site, related_name="pages", verbose_name=_("Site"))
	title = models.CharField(_("Title"), max_length=100)
	slug = models.CharField(_('URL'), max_length=100, blank=True, null=True)
	parent = TreeForeignKey('self', null=True, blank=True, verbose_name=_("Parent"), related_name='children')
	in_navigation = models.BooleanField(_('In Navigation'), default=True)
	_cached_url = models.CharField(_('Cached URL'), max_length=300, blank=True, editable=False, default='', db_index=True)
	is_link = models.BooleanField(_('Is Link'), default=False)
	content = RichTextField(_("Content"))

	class Meta:
		verbose_name = _("Page")
		verbose_name_plural = _("Pages")
		ordering = ('tree_id', 'lft')

	objects = PageManager()

	def __init__(self, *args, **kwargs):
		super(Page, self).__init__(*args, **kwargs)
		self._original_cached_url = self._cached_url

	def __unicode__(self):
		return self.slug

	def is_active(self):
		if not self.pk:
			return False

		pages = Page.objects.active().filter(tree_id=self.tree_id, lft__lte=self.lft, rght__gte=self.rght)
		return pages.count() > self.level

	@commit_on_success
	def save(self, *args, **kwargs):

		cached_page_urls = {}

		if self.is_root_node():
			self._cached_url = u'/%s/' % self.slug
		else:
			self._cached_url = u'%s%s/' % (self.parent._cached_url, self.slug)
		super(Page, self).save(*args, **kwargs)

		if self.is_leaf_node() or self._cached_url == self._original_cached_url:
			return

		descendants = self.get_descendants()

		stack = [self]
		parent = self
		for page in descendants:
			while parent.rght < page.rght:
				stack.pop()
				parent = stack[-1]
			page._cached_url = u'%s%s/' % (parent._cached_url, page.slug)
			super(Page, page).save()

	@models.permalink
	def get_absolute_url(self):
		url = self._cached_url.strip('/')
		if url:
			return ('vsite_handler', (url,), {})
		return ('vsite_home', (), {})

from vsite.manage.sites import site, ModelManage, TreeModelManage
from mptt.forms import MPTTAdminForm

class PageManage(TreeModelManage):
	fields = ("site", "parent", "title", "slug", "is_link", "content", "publish_date", "status")
	list_display = ('title', "site", "slug", "publish_date")
	readonly_fields = ()

	form = MPTTAdminForm

site.register(Page, PageManage)

