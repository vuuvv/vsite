from django.conf.urls import patterns, include, url

urlpatterns = patterns('vsite.filemanage.views',
    url(r'^$', 'index'),
	url(r'^upload/$', 'upload'),
)
