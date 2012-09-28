# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response

from mptt.templatetags.mptt_tags import cache_tree_children

from vsite.pages.models import Page
from vsite.utils import generate_tree_nav

def map(request, slug="", extra_context=None):
	return render_to_response('map.xml')

