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

def generate_pages_nav(pages):
	result = ["<ul>"]

	stack = [page[0]]
	last_page = page[0]
	for page in descendants:
		parent = stack[-1]
		# child node
		if page.rght < last_page.rght:
			stack.append(last_page)
			parent = last_page
			result.append("<ul>")
		else:
			# tree up
			if page.rght > parent.rght:
				while page.rght > parent.rght:
					stack.pop()
					parent = stack[-1]
					result.append("</ul></li>")
			else:
				result.append("</li>")

		result.append(page.title)
		last_page = page

