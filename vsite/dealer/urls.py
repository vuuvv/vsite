from django.conf.urls import patterns, include, url

urlpatterns = patterns('vsite.dealer.views',
    url(r'^$', "index", name="dealer_index"),
    url(r'^dealers/$', 'dealers', name='dealer_list'),
    url(r'^boundary/$', 'boundary', name='dealer_list'),
)
