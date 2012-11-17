# Create your views here.
from django.http import HttpResponse
from django.template.response import TemplateResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import Area, Dealer
from vsite.pages.middleware import get_page_context
from vsite.utils import render_to_json, models_to_json

def index(request, slug=None, template="dealer/index.html", extra_context=None):
    china = Area.objects.get(pk=1)
    provinces = china.get_children()
    context = get_page_context("/sales/dealer/")
    context["provinces"] = provinces
    extra_context.update(context)
    return TemplateResponse(request, template, extra_context)

def cities(request, pid, extra_context=None):
    provinces = Area.objects.get(pk=pid)
    cities = provinces.get_children()
    return render_to_json({
        "cities": models_to_json(cities)
    })

def dealers(request, aid, extra_context=None):
    area = Area.objects.get(pk=aid)
    areas = area.get_leafnodes(include_self=True)
    dealers = Dealer.objects.select_related('area').filter(area__in=areas)
    return render_to_json({
        "dealers": models_to_json(dealers)
    })

def boundary(request, extra_context=None):
    provinces = Area.objects.root_nodes()[0].get_children()
    return render_to_json({
        "boundaries": dict([(p.name, p.boundary.strip()) for p in provinces])
    })

