
from django.db import models
from django.db.models import Q
from django.http import Http404
from django.utils.translation import ugettext_lazy as _

from mptt.managers import TreeManager

from vsite.core.managers import ActiveAwareContentManagerMixin

class PageManager(TreeManager):

	def page_for_path(self, path, raise404=False):
		"""
		make the path as '/a/b/c/' or '/' pattern.
		"""
		stripped = path.strip('/')
		try:
			return self.active().get(_cached_url=stripped and u'/%s/' % stripped or '/')
		except self.model.DoesNotExist:
			if raise404:
				raise Http404
			raise

	def in_navigation(self):
		return self.active().filter(in_navigation=True)

	def top_level_navigation(self):
		return self.in_navigation().filter(parent__isnull=True)

	def active(self):
		return self.filter(active=True)

#PageManager.add_to_active_filters(Q(active=True))
