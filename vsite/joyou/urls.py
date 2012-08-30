from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('vsite.joyou.views',
    # Examples:
    url(r'^$', 'index', name="joyou_home"),
    url(r'^about/$', 'about', name=""),
    url(r'^news/$', 'news', name=""),
    url(r'^news/company/$', 'company', name=""),
    url(r'^news/company/1$', 'article', name=""),
    url(r'^news/magzine/$', 'magzine', name=""),
    url(r'^news/brand/$', 'brand', name=""),
    url(r'^product/$', 'joyou_serials', name=""),
    url(r'^product/serials/$', 'joyou_serials', name=""),
    url(r'^product/serials/joyou/$', 'joyou_serials', name=""),
    url(r'^product/serials/joyou/city/$', 'city', name=""),
    url(r'^product/joyou/$', 'joyou_categories', name=""),
    url(r'^product/joyou/faucet/$', 'joyou_faucet', name=""),
    url(r'^product/joyou/faucet/shunv/$', 'joyou_shunv', name=""),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
