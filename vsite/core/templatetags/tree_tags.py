from django import template
from django.conf import settings
from django.utils.safestring import mark_safe

from django.template.base import (Node, NodeList, Library, TemplateSyntaxError,
		VariableDoesNotExist)

from mptt.templatetags.mptt_tags import cache_tree_children

register = Library()

class TreeForNode(Node):
	def __init__(self, loopvar, sequence, nodelist_loop):
		self.loopvar, self.sequence = loopvar, sequence
		self.nodelist_loop = nodelist_loop

	def __repr__(self):
		return "<TreeFor Node: treefor %s in %s, tail_len: %d%s>" % (
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

		loop_dict = context['treeforloop'] = {}
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

@register.tag('treefor')
def do_for(parser, token):
	parts = token.contents.split()
	if len(parts) != 4:
		raise TemplateSyntaxError("'treefor' statements should have four"
				" words: %s" % token.contents)
	if parts[2] != 'in':
		raise TemplateSyntaxError("'treefor' statements should use the format"
				" 'treefor x in y': %s" % token.contents)
	loopvar = parts[1]
	sequence = parser.compile_filter(parts[-1])
	nodelist_loop = parser.parse(('endtreefor',))
	token = parser.next_token()
	return TreeForNode(loopvar, sequence, nodelist_loop)

class RecurseTreeNode(template.Node):
	def __init__(self, template_nodes, queryset_var):
		self.template_nodes = template_nodes
		self.queryset_var = queryset_var
		self.depth = 0

	def _render_node(self, context, node):
		bits = []
		context.push()
		for child in node.get_children():
			context['node'] = child
			bits.append(self._render_node(context, child))
		context['node'] = node
		context['children'] = mark_safe(u''.join(bits))
		rendered = self.template_nodes.render(context)
		context.pop()
		return rendered

	def render(self, context):
		queryset = self.queryset_var.resolve(context)
		roots = cache_tree_children(queryset)
		bits = [self._render_node(context, node) for node in roots]
		return ''.join(bits)

@register.tag
def recursetree(parser, token):
	bits = token.contents.split()
	if len(bits) != 2:
		raise template.TemplateSyntaxError(_('%s tag requires at least queryset') % bits[0])

	queryset_var = template.Variable(bits[1])

	template_nodes = parser.parse(('endrecursetree',))
	parser.delete_first_token()

	return RecurseTreeNode(template_nodes, queryset_var)

