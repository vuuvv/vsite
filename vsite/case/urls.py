from django.conf.urls import patterns, include, url

urlpatterns = patterns('vsite.case.views',
	url(r'^$', 'case', name="case_home"),
	url(r'^(?P<slug>[^/]+)/$', 'case', name="case"),
)
