from django.db import ModelBase

class AlreadyRegisted(Exception):
	pass

class NotRegistered(Exception):
	pass

class ManageSite(object):

	def __init__(self, name='manage', app_name='manage'):
		self._menus = {}
		self._registed = set()
		self.name = name
		self.app_name = app_name

	def register(self, menu_name, models, manage_class=None):
		if not manage_class:
			manage_class = ModelManage

		if isinstance(models, ModelBase):
			models = [models]

		if menu_name not in self._menus:
			self._menus[menu_name] = []
		menu = self._menus[menu_name]

		for model in models:
			if model._meta.abstract:
				raise ImproperlyConfigured('The model %s is abstract, so it '
					'cannot be registered with manage.' % model.__name__)

			if model in self._registed:
				raise AlreadyRegistered('The model %s is already registered' % model.__name__)

			self._registed.add(model)
			menu.append(manage_class(model, self))

	@property
	def urls(self):
		return self.get_urls(), self.app_name, self.name






