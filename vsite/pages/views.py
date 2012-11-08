# Create your views here.
from django.http import HttpResponse
from django.template.response import TemplateResponse


from vsite.pages.models import Page
from vsite.utils import generate_tree_nav

def page(request, slug="", template="pages/page.html", extra_context=None):
    if slug == "" or slug == "/":
        slug = '/'
    else:
        slug = '/%s/' % slug.strip("/")

    page = extra_context["page"]
    if slug == "/":
        template_name = u"index"
    else:
        template_name = u"column_%d" % page.col

    templates = [u"pages/%s.html" % template_name]
    templates.append(template)

    return TemplateResponse(request, templates, extra_context)
