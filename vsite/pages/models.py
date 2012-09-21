import re
from datetime import datetime
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.sites.models import Site
from django.db.transaction import commit_on_success

from mptt.models import MPTTModel, TreeForeignKey

from vsite.core.models import Publishable
from vsite.core.fields import RichTextField

from .managers import PageManager

class Page(MPTTModel):
	site = models.ForeignKey(Site, related_name="pages", verbose_name=_("Site"))
	parent = TreeForeignKey('self', null=True, blank=True, verbose_name=_("Parent"), related_name='children')
	title = models.CharField(_('Title'), max_length=100)
	slug = models.CharField(_('Slug'), max_length=100, blank=True, null=True)
	in_navigation = models.BooleanField(_('In Navigation'), default=True)
	publish_date = models.DateTimeField(_("Published from"),
		help_text=_("With published checked, won't be shown until this time"),
			  blank=True, null=True)
	active = models.BooleanField(_("Is Active"), default=True)
	cached_url = models.CharField(_('URL'), max_length=300, blank=True, editable=False, default='', db_index=True)
	content = RichTextField(_("Content"), blank=True)
	meta_keywords = models.TextField(_("Meta keywords"), blank=True)
	meta_description = models.TextField(_("Meta description"), blank=True)

	class Meta:
		verbose_name = _("Page")
		verbose_name_plural = _("Pages")
		ordering = ('tree_id', 'lft')

	objects = PageManager()

	def __init__(self, *args, **kwargs):
		super(Page, self).__init__(*args, **kwargs)
		self._originalcached_url = self.cached_url

	def __unicode__(self):
		return "%s(%s)" % (self.title, self.cached_url)

	def is_active(self):
		if not self.pk:
			return False

		pages = Page.objects.active().filter(tree_id=self.tree_id, lft__lte=self.lft, rght__gte=self.rght)
		return pages.count() > self.level

	@commit_on_success
	def save(self, *args, **kwargs):

		cached_page_urls = {}

		if self.is_root_node():
			if self.slug:
				self.cached_url = u'/%s/' % self.slug
			else:
				self.cached_url = u'/'
		else:
			self.cached_url = u'%s%s/' % (self.parent.cached_url, self.slug)

		if self.publish_date is None:
			self.publish_date = datetime.now()
		super(Page, self).save(*args, **kwargs)

		if self.is_leaf_node() or self.cached_url == self._originalcached_url:
			return

		descendants = self.get_descendants()

		stack = [self]
		last_page = self
		for page in descendants:
			parent = stack[-1]
			# child node
			if page.rght < last_page.rght:
				stack.append(last_page)
				parent = last_page
			else:
				# tree up
				while page.rght > parent.rght:
					stack.pop()
					parent = stack[-1]

			page.cached_url = u'%s%s/' % (parent.cached_url, page.slug)
			super(Page, page).save()
			last_page = page

	@models.permalink
	def get_absolute_url(self):
		url = self.cached_url.strip('/')
		if url:
			return ('vsite_handler', (url,), {})
		return ('vsite_home', (), {})

from vsite.manage.sites import site, ModelManage, TreeModelManage
from mptt.forms import MPTTAdminForm

class PageManage(TreeModelManage):
	label = _("Page")
	title = "title"
	fields = ("site", "parent", "title", "slug", "active", "in_navigation", "publish_date")
	list_display = ("title", "site", "publish_date")
	readonly_fields = ()

	form = MPTTAdminForm

site.register(Page, PageManage)

