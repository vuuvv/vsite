# Create your views here.
from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import Category, Honor
from vsite.pages.middleware import get_page_context
from vsite.utils import chunks

def honor_list(request, slug=None, template="honor/index.html", extra_context=None):
	honors = Honor.objects.all()
	context = get_page_context("/about/honor/")
	context["chunks"] = chunks(honors, 3)
	extra_context.update(context)
	return TemplateResponse(request, template, extra_context)

