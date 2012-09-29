from django.conf.urls import patterns, include, url

urlpatterns = patterns('vsite.pages.views',
    url(r'^$', 'page', name="vsite_home"),
    url(r'^(?P<slug>.*)/$', 'page', name="vsite_handler"),
)
