from django.template.loader import find_template, find_template_loader
from django.template.base import Library, Node, TemplateDoesNotExist
from django.conf import settings

register = Library()

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

@register.tag
def sri(parser, token):
	bits = token.contents.split()
	return SriNode(bits[1])

class SriNode(Node):
	def __init__(self, template_path):
		self.raw = get_template_source(template_path)

	def render(self, context):
		return self.raw
