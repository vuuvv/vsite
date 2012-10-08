from django.conf.urls import patterns, include, url

urlpatterns = patterns('vsite.dealer.views',
	url(r'^$', "index", name="dealer_index"),
)
