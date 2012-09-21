# Create your views here.
from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from vsite.pages.models import Page
from vsite.pages.middleware import get_page_context
from .models import Product, Category

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

def get_product_context(item, ancestors):
	context = get_page_context('/product/')
	items = list(context["ancestors"]) + list(ancestors)
	items.append(item)
	context["left_current"] = items[1] if len(items) > 1 else items[0]
	context["ancestors"] = items
	context["item"] = item
	return context

def chunks(arr, n):
	return [arr[i:i+n] for i in range(0, len(arr), n)]

def chunks_n(arr, n):
    n = int(math.ceil(len(arr) / float(m)))
    return [arr[i:i + n] for i in range(0, len(arr), n)]

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
	ancestors = category.get_ancestors()
	context = get_product_context(category, ancestors)
	if category.is_leaf_node():
		template = 'product/product_list.html'
		item_list = category.products.all()

		page_size = 15
		paginator = Paginator(item_list, page_size)
		try:
			items = paginator.page(page)
		except PageNotAnInteger:
			items = paginator.page(1)
		except EmptyPage:
			items = paginator.page(paginator.num_pages)
		_get_pages(items, 6)
		context["chunks"] = chunks(list(items), 3)
	else:
		items = category.get_children()
		if len(ancestors) == 0:
			template = 'product/category_top.html'

	context["items"] = items
	extra_context.update(context)
	return TemplateResponse(request, template, extra_context)

def detail(request, slug, template="product/detail.html", extra_context=None):
	product = Product.objects.get(slug=slug.upper())
	category = product.categories.all()[0]
	ancestors = category.get_ancestors(include_self=True)

	context = get_product_context(product, ancestors)
	extra_context.update(context)
	return TemplateResponse(request, template, extra_context)
