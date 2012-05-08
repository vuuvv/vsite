# Create your views here.
from django.shortcuts import render_to_response

from vsite.pages.models import Page

def page(request):
	return render_to_response('pages/page.html', {
		"page": Page.objects.get(id=1),
		"menus": Page.objects.all(),
	})
