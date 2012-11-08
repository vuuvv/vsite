from django.contrib import admin

from .models import Page
from mptt.admin import MPTTModelAdmin

class PageAdmin(MPTTModelAdmin):
	list_display = ('title', 'publish_date', 'active')
	list_filter = ['publish_date', 'active']
	search_fields = ['title', 'content']
	fields = ['site', 'parent', 'title', 'slug', 'col', 'content', 'active', 'in_navigation', 'publish_date']

admin.site.register(Page, PageAdmin)
