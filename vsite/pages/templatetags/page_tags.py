from django.conf import settings
from django.template.base import (Node, NodeList, Library, TemplateSyntaxError,
		VariableDoesNotExist)

register = Library()

class PageForNode(Node):
	def __init__(self, loopvar, sequence, nodelist_loop):
		self.loopvar, self.sequence = loopvar, sequence
		self.nodelist_loop = nodelist_loop

	def __repr__(self):
		return "<PageFor Node: pagefor %s in %s, tail_len: %d%s>" % (
				self.loopvar, self.sequence, len(self.nodelist_loop))

	def __iter__(self):
		for node in self.nodelist_loop:
			yield node

	def render(self, context):
		try:
			values = self.sequence.resolve(context, True)
		except VariableDoesNotExist:
			values = []
		if values is None:
			values = []
		if not hasattr(values, '__len__'):
			values = list(values)
		len_values = len(values)

		nodelist = NodeList()
		loopvar = self.loopvar

		loop_dict = context['pageforloop'] = {}
		for i, item in enumerate(values):
			loop_dict['counter0'] = i
			loop_dict['counter'] = i + 1
			loop_dict['revcounter'] = len_values - i
			loop_dict['revcounter0'] = len_values - i - 1
			loop_dict['first'] = (i==0)
			loop_dict['last'] = (i == len_values - 1)
			context[loopvar] = item

			if settings.TEMPLATE_DEBUG:
				for node in self.nodelist_loop:
					try:
						nodelist.append(node.render(context))
					except Exception, e:
						if not hasattr(e, 'django_template_source'):
							d.django_template_source = node.source
						raise
			else:
				for node in self.nodelist_loop:
					nodelist.append(node.render(content))

		return nodelist.render(context)

@register.tag('pagefor')
def do_for(parser, token):
	parts = token.contents.split()
	if len(parts) != 4:
		raise TemplateSyntaxError("'pagefor' statements should have four"
				" words: %s" % token.contents)
	if parts[2] != 'in':
		raise TemplateSyntaxError("'pagefor' statements should use the format"
				" 'pagefor x in y': %s" % token.contents)
	loopvar = parts[1]
	sequence = parser.compile_filter(parts[-1])
	nodelist_loop = parser.parse(('endpagefor',))
	token = parser.next_token()
	return PageForNode(loopvar, sequence, nodelist_loop)
