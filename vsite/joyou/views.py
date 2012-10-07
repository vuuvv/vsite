# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template.response import TemplateResponse
from django.db.models import Q

from mptt.templatetags.mptt_tags import cache_tree_children

from vsite.pages.models import Page
from vsite.press.models import Press
from vsite.product.models import Product

from vsite.utils import chunks
from vsite.pages.middleware import get_navigate_pages

def map(request, slug="", extra_context=None):
    return render_to_response('map.xml')

def index(request, slug="", template="pages/index.html", extra_context=None):
    latest = Press.objects.all()[:3]
    extra_context["latest"] = latest
    return TemplateResponse(request, template, extra_context)

def search(request, keyword="", template="search.html", extra_context=None):
    keyword = keyword.lower()
    products = Product.objects.filter(active=True).filter(Q(name__contains=keyword) |
                                                          Q(sku__contains=keyword) )

    extra_context["pages"] = get_navigate_pages()
    products = list(products)
    extra_context["chunks"] = chunks(products, 4)
    return TemplateResponse(request, template, extra_context)

