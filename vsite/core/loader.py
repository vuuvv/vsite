from django.template.loader import BaseLoader
from django.template import TemplateDoesNotExist
from django.core import urlresolvers
from django.conf import settings
import jinja2

class Template(jinja2.Template):
	def render(eslf, context):
		context_dict = {}
		for d in context.dicts:
			context_dict.update(d)
		return super(Template, self).render(context_dict)

class Loader(BaseLoader):
	is_usable = True
	env = jinja2.Environment(loader=jinja2.FileSystemLoader(settings.TEMPLATE_DIRS))
	env.template_class = Template

	env.globals['url_for'] = urlresolvers.reverse
	env.globals['MEDIA_URL'] = settings.MEDIA_URL

	def load_template(self, template_name, template_dirs=None):
		try:
			template = self.env.get_template(template_name)
		except jinja2.TemplateNotFound:
			raise TemplateDoesNotExist(template_name)
		return template, template.filename
