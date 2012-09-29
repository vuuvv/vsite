from django.conf.urls import patterns, include, url

#from filebrowser.sites import site

from django.contrib import admin
admin.autodiscover()

from vsite import manage
from vsite import filemanage

urlpatterns = patterns('',
    url(r'^manage/', include(manage.site.urls), name='manage'),
    url(r'^files/', include(filemanage.site.urls), name='filemanage'),
    #url(r'^admin/filebrowser/', include(site.urls)),
    url(r'^admin/', include(admin.site.urls)),
    #(r'^grappelli/', include('grappelli.urls')),
    url(r'^', include('vsite.joyou.urls'), name='pages'),
    # url(r'^site_demo/', include('site_demo.foo.urls')),
    #(r'^grappelli/', include('grappelli.urls')),
)
