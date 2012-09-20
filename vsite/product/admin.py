from django.contrib import admin

from mptt.admin import MPTTModelAdmin

from .models import Product, Category

class CategoryAdmin(MPTTModelAdmin):
	list_display = ('name', 'active', 'site')
	list_filter = ['active', 'site']
	search_fields = ['name', 'slug']
	fields = ['site', 'parent', 'name', 'slug', 'description', 'image']

admin.site.register(Category, CategoryAdmin)

#class PressAdmin(admin.ModelAdmin):
#	list_display = ('title', 'publish_date', 'category', 'author', 'press_from')
#	list_filter = ['category', 'publish_date', 'is_active']
#	search_fields = ['title', 'content']
#	fields = ['title', 'sub_title', 'category', 'author', 'press_from', 'summary', 'content', 'is_active', 'publish_date', 'tags', 'thumbnail']
#
#admin.site.register(Press, PressAdmin)
