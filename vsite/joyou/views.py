# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template.response import TemplateResponse

from mptt.templatetags.mptt_tags import cache_tree_children

from vsite.pages.models import Page
from vsite.press.models import Press
from vsite.utils import generate_tree_nav

def map(request, slug="", extra_context=None):
	return render_to_response('map.xml')

def index(request, slug="", template="pages/index.html", extra_context=None):
	latest = Press.objects.all()[:3]
	extra_context["latest"] = latest
	return TemplateResponse(request, template, extra_context)

