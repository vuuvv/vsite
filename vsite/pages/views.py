# Create your views here.
from django.shortcuts import render_to_response

from vsite.pages.models import Page

def page(request):
	return render_to_response('pages/page.html', {
		"menus": Page.objects.all(),
	})
