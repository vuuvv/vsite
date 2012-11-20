from django.conf.urls import patterns, include, url

urlpatterns = patterns('vsite.press.views',
	url(r'^$', 'index', name="press_home"),
	url(r'^brand/', 'brand_index', name="brand_home"),
	url(r'^magzine/$', 'magzine_index', name="magzine_home"),
	url(r'^(?P<category>([^/])*)/$', 'category', name="press_category"),
	url(r'^(?P<category>([^/])*)/p/(?P<page>\d+)/$', 'category', name="press_category"),
	url(r'^(?P<category>([^/])*)/(?P<id>\d*)/$', 'press', name="press_article"),
)
