from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('vsite.joyou.views',
    # Examples:
    url(r'^$', 'index', name="joyou_home"),
    url(r'^about/$', 'about', name=""),
    url(r'^news/$', 'news', name=""),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)