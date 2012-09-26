from django.conf.urls import patterns, include, url

urlpatterns = patterns('vsite.joyou.views',
    url(r'^news/', include("vsite.press.urls")),
    url(r'^product/', include("vsite.product.urls")),
    url(r'^about/honor/', include("vsite.honor.urls")),
    url(r'^', include("vsite.pages.urls")),
)
