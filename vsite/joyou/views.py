# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response

from mptt.templatetags.mptt_tags import cache_tree_children

from vsite.pages.models import Page
from vsite.utils import generate_tree_nav

def index(request, slug=""):
	pages = Page.objects.all()

	return render_to_response('pages/index.html', {
		"pages": pages,
	})

def about(request, slug=""):
	return render_to_response('pages/about.html', {
		"pages": Page.objects.all(),
	})

def news(request, slug=""):
	return render_to_response('news/index.html', {
		"pages": Page.objects.all(),
	})

def company(request, slug=""):
	return render_to_response('news/company.html', {
		"pages": Page.objects.all(),
	})

def magzine(request, slug=""):
	return render_to_response('news/magzine.html', {
		"pages": Page.objects.all(),
	})

def article(request, slug=""):
	return render_to_response('news/article.html', {
		"pages": Page.objects.all(),
	})

def joyou_serials(request, slug=""):
	return render_to_response('product/joyou_serials.html', {
		"pages": Page.objects.all(),
	})

def city(request, slug=""):
	return render_to_response('product/city.html', {
		"pages": Page.objects.all(),
	})


def joyou_categories(request, slug=""):
	return render_to_response('product/joyou_categories.html', {
		"pages": Page.objects.all(),
	})

def joyou_faucet(request, slug=""):
	return render_to_response('product/joyou_faucet.html', {
		"pages": Page.objects.all(),
	})

def joyou_shunv(request, slug=""):
	return render_to_response('product/joyou_shunv.html', {
		"pages": Page.objects.all(),
	})


