from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.utils import simplejson as json
from django.utils.translation import ugettext_lazy as _

from vsite.core.utils import get_template_source

menus = [
	{
		"title": _("System"),
		"children": [_("Settings"), _("File Manage"), _("Site")],
	},
	{
		"title": _("Account"),
		"children": [_("User"), _("Role"), _("Permission")],
	},
	{
		"title": _("Content"),
		"children": [_("URL"), _("Page")],
	},
	{
		"title": _("Logout"),
		"children": [],
	}
]

def index(request):
	return render_to_response("manage/home/index.html", {
		"menus": menus,
	})

def template(request, name):
	return HttpResponse(
		get_template_source("manage/backbone/%s.html" % name)
	)

def accordion(request):
	accord = [
		{
			"name": "system",
			"children": ["app", "normal", "email", "sms"],
		},
		{
			"name": "model",
			"children": ["page", "user", "permission"],
		},
	]
	return HttpResponse(json.dumps(accord))

def fields(request, model):
	return HttpResponse(json.dumps([
		{
			"name": "title",
			"type": "StringField",
		},
		{
			"name": "content",
			"type": "TextField",
		},
		{
			"name": "age",
			"type": "IntegerField",
		},
	]))

