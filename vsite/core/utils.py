from django.template.loader import find_template, find_template_loader
from django.template.base import TemplateDoesNotExist
from django.conf import settings

template_source_loaders = None

def get_template_source(name, dirs=None):
	global template_source_loaders
	if template_source_loaders is None:
		loaders = []
		for loader_name in settings.TEMPLATE_LOADERS:
			loader = find_template_loader(loader_name)
			if loader is not None:
				loaders.append(loader)
		template_source_loaders = tuple(loaders)
	for loader in template_source_loaders:
		try:
			source, display_name = loader.load_template_source(name)
			return source
		except TemplateDoesNotExist:
			pass
	raise TemplateDoesNotExist(name)

from django.contrib.staticfiles.finders import BaseStorageFinder
from django.core.files.storage import FileSystemStorage
class StaticRootFinder(BaseStorageFinder):
	def __init__(self, *args, **kwargs):
		self.storage = FileSystemStorage(location=settings.STATIC_ROOT)
		super(StaticRootFinder, self).__init__(*args, **kwargs)
