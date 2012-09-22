from django.conf.urls import patterns, include, url

urlpatterns = patterns('vsite.honor.views',
	url(r'^$', "honor_list", name="honor_index"),
	url(r'^(?P<slug>\w+)/$', 'honor_list', name="honor_list"),
)
