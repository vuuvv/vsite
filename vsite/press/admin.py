from django.contrib import admin

from .models import Press

class PressAdmin(admin.ModelAdmin):
	list_display = ('title', 'publish_date', 'category', 'author', 'press_from')
	list_filter = ['category', 'publish_date', 'is_active']
	search_fields = ['title', 'content']
	fields = ['title', 'sub_title', 'category', 'author', 'press_from', 'summary', 'content', 'is_active', 'publish_date', 'tags', 'thumbnail']

admin.site.register(Press, PressAdmin)
