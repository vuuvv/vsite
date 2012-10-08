# Create your views here.
from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import Area, Dealer
from vsite.pages.middleware import get_page_context

def index(request, slug=None, template="dealer/index.html", extra_context=None):
	areas = Area.objects.all()
	context = get_page_context("/sales/dealer/")
	extra_context.update(context)
	return TemplateResponse(request, template, extra_context)

