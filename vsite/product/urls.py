from django.conf.urls import patterns, include, url

urlpatterns = patterns('vsite.product.views',
	url(r'^$', 'style_category', name="product_home"),
	url(r'^style/$', 'style_category', name="style_home"),
	url(r'^style/detail/(?P<slug>\w+)/$', 'style_detail', name="style_detail"),
	url(r'^style/(?P<slug>\w+)/$', 'style_category', name='style_category'),
	url(r'^detail/(?P<slug>.+)/$', 'detail', name="product_detail"),
	url(r'^(?P<slug>.+)/p/(?P<page>\d+)/$', 'category', name="product_category"),
	url(r'^(?P<slug>.+)/$', 'category', name="product_category"),
)
