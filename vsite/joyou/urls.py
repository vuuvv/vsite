from django.conf.urls import patterns, include, url

urlpatterns = patterns('vsite.joyou.views',
    url(r'^news/', include("vsite.press.urls")),
    url(r'^product/', include("vsite.product.urls")),
    url(r'^about/honor/', include("vsite.honor.urls")),
    url(r'^about/jobs/', include("vsite.jobs.urls")),
    url(r'^sales/cases/', include("vsite.case.urls")),
    url(r'^module/network/map.asp', "map"),
    url(r'^', include("vsite.pages.urls")),
)
