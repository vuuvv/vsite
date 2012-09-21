from django.conf.urls import patterns, include, url

urlpatterns = patterns('vsite.product.views',
	url(r'^$', 'index', name="product_home"),
	url(r'^detail/(?P<slug>\w+)/$', 'detail', name="product_detail"),
	url(r'^(?P<slug>([^/])+)/$', 'category', name="product_category"),
	url(r'^(?P<slug>([^/])+)/p/(?P<page>\d+)/$', 'category', name="product_category"),
)
