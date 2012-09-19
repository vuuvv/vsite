# Create your views here.
from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from vsite.pages.models import Page
from vsite.pages.middleware import get_page_context
from .models import PressCategory, Press

def index(request, template="press/index.html", extra_context=None):
	return TemplateResponse(request, templates, extra_context)

def category(request, category, page=1, template="press/category.html", extra_context=None):
	category = PressCategory.objects.get(slug=category)
	curl = category.get_absolute_url();
	context = get_page_context(curl);
	article_list = Press.objects.filter(category=category)
	paginator = Paginator(article_list, 5)
	try:
		articles = paginator.page(page)
	except PageNotAnInteger:
		articles = paginator.page(1)
	except EmptyPage:
		articles = paginator.page(paginator.num_pages)
	extra_context.update(context)
	extra_context["articles"] = articles
	return TemplateResponse(request, template, extra_context)

def press(request, category, id, template="press/article.html", extra_context=None):
	category = PressCategory.objects.get(slug=category)
	article = Press.objects.get(pk=id)
	curl = category.get_absolute_url();
	context = get_page_context(curl);
	context["ancestors"] = context["ancestors"][:]
	context["ancestors"].append(article)
	extra_context.update(context)
	extra_context["article"] = article
	return TemplateResponse(request, template, extra_context)
