from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.utils import simplejson as json

from vsite.core.utils import get_template_source

def index(request):
	return render_to_response("manage/home/index.html")

def template(request, name):
	return HttpResponse(
		get_template_source("manage/backbone/%s.html" % name)
	)

def accordion(request):
	accord = [
		{
			"name": "system",
			"children": ["normal", "email", "sms"],
		},
		{
			"name": "model",
			"children": ["page", "user", "permission"],
		},
	]
	return HttpResponse(json.dumps(accord))

