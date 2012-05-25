from django.template.base import Library, Node

from vsite.core.utils import get_template_source

register = Library()

@register.tag
def sri(parser, token):
	bits = token.contents.split()
	return SriNode(bits[1])

class SriNode(Node):
	def __init__(self, template_path):
		self.raw = get_template_source(template_path)

	def render(self, context):
		return self.raw
