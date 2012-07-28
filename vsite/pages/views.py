# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response

from vsite.pages.models import Page
from vsite.utils import generate_tree_nav

def page(request, slug=""):
	if slug == "":
		url = u'/'
	else:
		url = u'/%s/' % slug
	page = Page.objects.get(_cached_url=url)
	pages = list(Page.objects.all())
	ancestors = [p for p in pages if p.lft < page.lft and p.rght > page.rght]
	return render_to_response('pages/page.html', {
		"page": page,
		"pages": pages,
		"ancestors": ancestors,
	})
