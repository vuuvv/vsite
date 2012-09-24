from django.contrib import admin

from .models import Press, Magzine, MagzineImage, MagzineYear

class PressAdmin(admin.ModelAdmin):
	list_display = ('title', 'publish_date', 'category', 'author', 'press_from')
	list_filter = ['category', 'publish_date', 'is_active']
	search_fields = ['title', 'content']
	fields = ['title', 'sub_title', 'category', 'author', 'press_from', 'summary', 'content', 'is_active', 'publish_date', 'tags', 'thumbnail']

admin.site.register(Press, PressAdmin)

class MagzineImageAdmin(admin.TabularInline):
	model = MagzineImage
	fields = ("page", "image")

admin.site.register(MagzineImage)
admin.site.register(MagzineYear)

class MagzineAdmin(admin.ModelAdmin):
	list_display = ("name", "slug", "active")
	search_field = ("name", )
	fields = ("name", "year", "slug", "thumbnail", "active", )
	inlines =(MagzineImageAdmin, )

admin.site.register(Magzine, MagzineAdmin)
