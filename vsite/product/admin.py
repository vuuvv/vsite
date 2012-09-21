from django.contrib import admin

from mptt.admin import MPTTModelAdmin

from .models import Product, Category, Property, PropertyKey, Technology

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

class PropertyAdmin(admin.TabularInline):
	model = Property
	fields = ('key', 'value')

admin.site.register(Property)

class ProductAdmin(admin.ModelAdmin):
	list_display = ('sku', 'name', 'slug', 'get_categories')
	search_fields = ('sku', 'name', 'technology')
	fields = (
		'sku', 'name', 'slug', 'categories', 'image', 'thumbnail', 
		'summary', 'assembly', 'manual', 'technologies', 'ordering',
		'tags', 'active',
	)
	filter_horizontal = ('technologies', 'categories')
	inlines = (PropertyAdmin,)

admin.site.register(Product, ProductAdmin)

admin.site.register(PropertyKey)
admin.site.register(Technology)
