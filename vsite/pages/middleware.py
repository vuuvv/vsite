from django.contrib.auth import REDIRECT_FIELD_NAME
from django.http import HttpResponse
from django.shortcuts import redirect
from django.utils.http import urlquote
from django.http import Http404
from django.conf import settings

from vsite.pages.models import Page


class PageMiddleware(object):
	"""
	Adds a page to the template context for the current response.

	If no page matches the URL, and the view function is not the
	fall-back page view, we try and find the page with the deepest
	URL that matches within the current URL, as in this situation,
	the app's urlpattern is considered to sit "under" a given page,
	for example the blog page will be used when individual blog
	posts are viewed. We want the page for things like breadcrumb
	nav, and page processors, but most importantly so the page's
	``login_required`` flag can be honoured.

	If a page is matched, and the fall-back page view is called,
	we add the page to the ``extra_context`` arg of the page view,
	which it can then use to choose which template to use.

	In either case, we add the page to the response's template
	context, so that the current page is always available.
	"""

	def process_view(self, request, view_func, view_args, view_kwargs):
		url = request.path
		if url.startswith("/manage/") or url.startswith("/admin/") or url.startswith("/module/"):
			return view_func(request, *view_args, **view_kwargs)
		extra_context = view_kwargs.setdefault("extra_context", {})
		extra_context.update(get_page_context(url))
		extra_context["NO_PIC"] = settings.NO_PIC
		return view_func(request, *view_args, **view_kwargs)

def cache_tree_children(queryset):
	"""
Takes a list/queryset of model objects in MPTT left (depth-first) order,
and caches the children on each node so that no further queries are needed.
This makes it possible to have a recursively included template without worrying
about database queries.

Returns a list of top-level nodes.
"""

	current_path = []
	top_nodes = []

	if hasattr(queryset, 'order_by'):
		mptt_opts = queryset.model._mptt_meta
		tree_id_attr = mptt_opts.tree_id_attr
		left_attr = mptt_opts.left_attr
		queryset = queryset.order_by(tree_id_attr, left_attr)

	if queryset:
		root_level = None
		for obj in queryset:
			node_level = obj.get_level()
			if root_level is None:
				root_level = node_level
			if node_level < root_level:
				raise ValueError(_("cache_tree_children was passed nodes in the wrong order!"))

			obj.cached_children = []

			while len(current_path) > node_level - root_level:
				current_path.pop(-1)

			if node_level == root_level:
				top_nodes.append(obj)
			else:
				current_path[-1].cached_children.append(obj)
			current_path.append(obj)
	return top_nodes

def get_navigate_pages():
	root = Page.objects.get(cached_url="/")
	return root.get_descendants().filter(active=True, in_navigation=True)

def get_page_context(url):
	if url != "/":
		url = "/%s/" % url.strip("/")
	try:
		page = Page.objects.get(cached_url=url)
	except Page.DoesNotExist:
		return {}
	if not page.active:
		raise Http404

	pages = get_navigate_pages()
	ancestors = []
	descendants = []
	current = None
	left_current = None
	if url != "/":
		ancestors = page.get_ancestors(include_self=True)[1:]
		current = ancestors[0]
		descendants = cache_tree_children(current.get_descendants())
		if len(ancestors) > 1:
			left_current = ancestors[1]

	return {
		"page": page,
		"pages": pages,
		"ancestors": ancestors,
		"current": current,
		"left_nav": descendants,
		"left_current": left_current,
	}

