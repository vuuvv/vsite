# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response

from mptt.templatetags.mptt_tags import cache_tree_children

from vsite.pages.models import Page
from vsite.utils import generate_tree_nav

def page(request, slug=""):
	if slug == "":
		url = u'/'
	else:
		url = u'/%s/' % slug
	page = Page.objects.get(_cached_url=url)
	#pages = cache_tree_children(Page.objects.all())
	pages = Page.objects.all()

	children = []
	ancestors = []

	for p in pages:
		if p.is_ancestor_of(page, True):
			ancestors.append(p)
		elif p.is_descendant_of(page):
			children.append(p)

	main_current = ancestors[0]
	main_nav = [p for p in pages if p.level < 2]

	left_current = ancestors[1] if len(ancestors) > 1 else []
	left_nav = [p for p in children if p.level < 4]

	for p in pages:
		if p in ancestors:
			print p._cached_url
	return render_to_response('pages/page.html', {
		"page": page,
		"main_nav": main_nav,
		"main_current": main_current,
		"ancestors": ancestors,
	})
