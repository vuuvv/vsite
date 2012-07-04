from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
#from django.contrib import admin
#admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^manage/', include('vsite.manage.urls'), name='manage'),
    url(r'^', include('vsite.pages.urls'), name='pages'),
    # url(r'^site_demo/', include('site_demo.foo.urls')),
    #(r'^grappelli/', include('grappelli.urls')),
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    #url(r'^admin/', include(admin.site.urls)),
)
