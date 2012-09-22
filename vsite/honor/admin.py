from django.contrib import admin

from .models import Honor, Category

admin.site.register(Category)

class HonorAdmin(admin.ModelAdmin):
	list_display = ('name', 'category', 'active', 'ordering')
	fields = ('category', 'name', 'active', 'image', 'thumbnail', 'ordering')

admin.site.register(Honor, HonorAdmin)
