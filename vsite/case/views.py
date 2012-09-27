from datetime import datetime

from django.template.response import TemplateResponse

from .models import Case, Category
from vsite.pages.middleware import get_page_context

def case(request, slug=None, template="case/case.html", extra_context=None):
	if not slug:
		category = Category.objects.all()[0]
	else:
		category = Category.objects.get(slug=slug)
	context = get_page_context("/sales/cases/")
	context["category"] = category
	extra_context.update(context)
	return TemplateResponse(request, template, extra_context)
