import json
import datetime
import decimal

from django.http import HttpResponse

class DjangoJSONEncoder(json.JSONEncoder):
	"""
	JSONEncoder subclass that knows how to encode date/time and decimal types.
	"""
	def default(self, o):
		# See "Date Time String Format" in the ECMA-262 specification.
		if isinstance(o, datetime.datetime):
			return o.strftime("%Y-%m-%d %H:%M:%S")
		elif isinstance(o, datetime.date):
			return o.strftime("%Y-%m-%d")
		elif isinstance(o, datetime.time):
			if is_aware(o):
				raise ValueError("JSON can't represent timezone-aware times.")
			return o.strftime("%H:%M:%S")
		elif isinstance(o, decimal.Decimal):
			return str(o)
		else:
			return super(DjangoJSONEncoder, self).default(o)

def tojson(obj):
	return json.dumps(obj, cls=DjangoJSONEncoder)

def render_to_json(obj, status, msg):
	obj["status"] = status
	obj["msg"] = msg
	return HttpResponse(tojson(obj))

default_top_nav_pattern = """
<li class="main_menu_item">
	<a class="main_menu_item_link" href="#">%s</a>
"""

default_sub_nav_pattern = """
<li class="main_menu_item">
	<a class="main_menu_item_link" href="#">%s</a>
"""

def generate_tree_nav(nodes, label_attr="title",
		top_pattern=default_top_nav_pattern, 
		sub_pattern=default_sub_nav_pattern):
	result = []
	stack = []

	for node in nodes:
		if len(stack) > 0:
			top = stack[-1]
			if top.tree_id != node.tree_id:
				# another tree
				result.append("</ul></li>" * len(stack))
				stack = []
			elif top.rght < node.rght:
				# tree up
				while top.rght < node.rght:
					stack.pop()
					result.append("</ul></li>")
					top = stack[-1]
			# append node 
			result.append(default_top_nav_pattern % getattr(node, label_attr))
		else:
			result.append(default_sub_nav_pattern % getattr(node, label_attr))

		if node.is_leaf_node():
			result.append("</li>")
		else:
			# tree down
			stack.append(node)
			result.append('<ul class="clearfix">')

	result.append("</ul></li>" * len(stack))

	return "\n".join(result)


#	stack = [nodes[0]]
#	last_page = nodes[0]
#	for node in nodes:
#		parent = stack[-1]
#		if node.rght < last_page.rght:
#			# tree down
#			stack.append(last_page)
#			result.append("<ul>")
#		else:
#			# tree up
#			if node.rght > parent.rght:
#				while node.rght > parent.rght:
#					stack.pop()
#					parent = stack[-1]
#					result.append("</ul></li>")
#			else:
#				result.append("</li>")
#
#		result.appdne("<li>")
#		result.append(node.title)
#		last_page = node

