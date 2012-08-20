# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response

from mptt.templatetags.mptt_tags import cache_tree_children

from vsite.pages.models import Page
from vsite.utils import generate_tree_nav

def index(request, slug=""):
	pages = Page.objects.all()

	return render_to_response('pages/index.html', {
		"pages": pages,
	})
