# Create your views here.
from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from vsite.pages.models import Page
from vsite.pages.middleware import get_page_context
from vsite.utils import chunks
from .models import PressCategory, Press, Magzine, MagzineYear

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

def index(request, template="press/index.html", extra_context=None):
    latest = []
    categories = PressCategory.objects.all()
    for cate in categories:
        articles = Press.objects.filter(category=cate)[:3]
        latest.append((cate, articles),)
    extra_context["latest"] = latest
    magzines = Magzine.objects.all()[:3]
    extra_context["magzines"] = magzines
    return TemplateResponse(request, template, extra_context)

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
    _get_pages(articles, 6)
    extra_context.update(context)
    extra_context["articles"] = articles
    extra_context["curl"] = curl
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

def brand_index(request, template="pages/column_2.html", extra_context=None):
    return TemplateResponse(request, template, extra_context)

def magzine_index(request, template="press/magzine_index.html", extra_context=None):
    years = MagzineYear.objects.all()
    year = years[0]
    magzines = list(year.magzines.all())
    items = []
    for i in range(12):
        if i < len(magzines):
            items.append(magzines[i])
        else:
            items.append(None)
    context = get_page_context("/news/magzine/")
    context["chunks"] = chunks(items, 4)
    extra_context.update(context)
    return TemplateResponse(request, template, extra_context)

