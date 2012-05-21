
@register.tag
def sri(parser, token):
	bits = token.contents.split()
	return SriNode(bits[1])

class SriNode(Node):
	def __init__(self, template_path):
		pass
