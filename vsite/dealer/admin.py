from django.contrib import admin

from mptt.admin import MPTTModelAdmin

from .models import Area, Dealer


class AreaAdmin(MPTTModelAdmin):
    list_display = ('name', 'parent')
    list_filter = ('parent__name', )
    search_fields = ('name', )
    fields = ('parent', 'name', 'boundary',)

admin.site.register(Area, AreaAdmin);

class DealerAdmin(admin.ModelAdmin):
    list_display = ('name', 'area', 'contact', 'active', 'tel', 'fax', 'website')
    list_filter = ('area__name', 'active')
    search_fields = ('name', 'area__name', 'address', 'tel', 'fax', 'website')
    fields = ('area', 'name', 'contact', 'mobile', 'tel', 'fax', 'address', 
              'website', 'active', 'zipcode', 'latitude', 'longitude')

admin.site.register(Dealer, DealerAdmin)
