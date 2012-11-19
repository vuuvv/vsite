from django.conf.urls import patterns, include, url

urlpatterns = patterns('vsite.dealer.views',
    url(r'^$', "index", name="dealer_index"),
    url(r'^area/(?P<aid>\d+)/$', 'dealers', name='dealer_list'),
    url(r'^cities/(?P<pid>\d+)/$', 'cities', name='cities_list'),
    url(r'^province/(?P<name>\w+)/$', 'province', name='province'),
    url(r'^boundary/$', 'boundary', name='dealer_list'),
)
