from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('vsite.manage.views',
    # Examples:
    url(r'^$', 'index'),
    url(r'^template/(?P<name>.*)', 'template'),
    url(r'^accordion', 'accordion'),
    url(r'api/fields/(?P<model>\w*)', 'fields')
    # url(r'^site_demo/', include('site_demo.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
