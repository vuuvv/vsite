# Create your views here.
from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from vsite.pages.models import Page
from vsite.pages.middleware import get_page_context
from .models import Product

def _get_pages(models, size=10):
	paginator = models.paginator
	num_pages = paginator.num_pages
	number = models.number
	after = num_pages - number
	pages = []
	half = size // 2
	if num_pages <= size:
		min, max = 1, num_pages
	elif number < half:
		min, max = 1, size
	elif after < half:
		min, max = num_pages - size + 1, num_pages
	else:
		min, max = number - half + 1, number + half
	paginator.min_page, paginator.max_page, paginator.all_pages = min, max, range(min, max+1)

def index(request, template="product/index.html", extra_context=None):
	latest = []
	categories = PressCategory.objects.all()
	for cate in categories:
		articles = Press.objects.filter(category=cate)[:3]
		latest.append((cate, articles),)
	extra_context["latest"] = latest
	return TemplateResponse(request, template, extra_context)

def category(request, slug, page=1, template="product/category.html", extra_context=None):
	category = Category.objects.get(slug=slug)
	ancestors = category.get_ancestors(include_self=True)
	if len(ancestors) == 1:
		# top
		template = 'product/category_top.html'
	elif category.is_leaf_node():
		# show product list
		template = 'product/product_list.html'

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
	_get_pages(articles, 6)
	extra_context.update(context)
	extra_context["articles"] = articles
	extra_context["curl"] = curl
	return TemplateResponse(request, template, extra_context)

def detail(request, slug, template="product/detail.html", extra_context=None):
	product = Product.objects.get(slug=slug.upper())
	category = product.categories.all()[0]
	ancestors = category.get_ancestors(include_self=True)

	context = get_page_context('/product/');
	context["ancestors"] = list(context["ancestors"]) + list(ancestors)
	context["ancestors"].append(product)
	extra_context.update(context)
	extra_context["product"] = product
	extra_context["left_current"] = ancestors[0]
	return TemplateResponse(request, template, extra_context)
