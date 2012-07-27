# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response

from vsite.pages.models import Page

def page(request, slug=""):
	if slug == "":
		url = u'/'
	else:
		url = u'/%s/' % slug
	page = Page.objects.get(_cached_url=url)
	return render_to_response('pages/page.html', {
		"page": page,
	})
