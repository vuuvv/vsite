from datetime import datetime

from django.template.response import TemplateResponse

from .models import Job
from vsite.pages.middleware import get_page_context

def index(request, template="jobs/index.html", extra_context=None):
	jobs = Job.objects.all()
	context = get_page_context("/about/jobs/")
	context["jobs"] = jobs
	context["now"] = datetime.now()
	extra_context.update(context)
	return TemplateResponse(request, template, extra_context)
