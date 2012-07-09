from django import forms
from django.shortcuts import render_to_response
from django.conf.urls import patterns, url, include
from django.db.models.base import ModelBase
from django.db.models import ForeignKey
from django.forms.models import modelform_factory
from django.utils.translation import ugettext_lazy as _
from django.shortcuts import _get_queryset

from vsite.utils import render_to_json

class AlreadyRegisted(Exception):
	pass

class NotRegistered(Exception):
	pass

class ModelManage(object):
	fields = None
	fieldsets = None

	form = forms.ModelForm
	list_display = ('__str__',)
	search_fields = ()
	inlines = []
	defer = set()
	ordering = ()
	readonly_fields = ()

	def __init__(self, model_cls, manage_site):
		self.model_cls = model_cls
		self.opts = model_cls._meta
		self.manage_site = manage_site
		self.fields_dict = self._get_fields(self.fields)

	@property
	def urls(self):
		return self.get_urls()

	def get_urls(self):
		urlpatterns = patterns('',
			url(r'^$', self.list_view, name=''),
			url(r'^add/$', self.add_view, name=''),
			url(r'^(\d+)/delete/$', self.delete_view, name=''),
			url(r'^(\d+)/$', self.upadate_view, name=''),
		)

		return urlpatterns

	def list_view(self, request):
		pass

	def delete_view(self, request, object_id):
		pass

	def add_view(self, request):
		ModelForm = modelform_factory(self.model_cls)
		if request.method == 'POST':
			form = ModelForm(request.POST, request.FILES)
			if form.is_valid():
				new_object = form.save()
				form_validated = True
				return render_to_json({"status": "success"})
			else:
				form_validated = False
				new_object = self.model_cls()
				return render_to_json({"status": "error", "msg":"invalid input"})

		fields_list = self._get_client_fields()
		opts = self.opts
		return render_to_json({
			"status": "success",
			"csrf_token": request.META["CSRF_COOKIE"],
			"model_name": self.model_cls.__name__,
			"app_label": opts.app_label,
			"module_name": opts.module_name,
			"fields": fields_list
		})

	def upadate_view(self, request, object_id):
		model_cls = self.model_cls
		try:
			obj = model_cls.objects.get(pk=object_id)
		except model_cls.DoesNotExist:
			return render_to_json({
				"status": "error",
				"msg": "Can't not load this %s" % model_cls.__name__
			})
		obj = get_object_or_404(self.model_cls, pk=object_id)
		opts = self.opts
		fields_list = self._get_client_fields()
		fields_dict = self.fields_dict
		get_field_by_name = self.opts.get_field_by_name
		for field in fields_list:
			name = field["name"]
			db_field = get_field_by_name(name)[0]
			if isinstance(db_field, ForeignKey):
				field["value"] = getattr(obj, db_field.column)
			else:
				field["value"] = getattr(obj, name)
		return render_to_json({
			"status": "success",
			"csrf_token": request.META["CSRF_COOKIE"],
			"model_name": self.model_cls.__name__,
			"app_label": opts.app_label,
			"module_name": opts.module_name,
			"fields": fields_list
		})

	def _get_client_fields(self, obj = None):
		model_cls = self.model_cls
		fields_list = []
		fields_dict = self.fields_dict
		json_fields_dict = {}
		readonly_fields = self.readonly_fields
		defer = self.defer
		#names = self.fields if self.fields is not None else self.fields_dict.keys()

		for db_field, formfield in self.fields_dict.items():
			field = {
				"name": name,
				"type": formfield.__class__.__name__,
				"readonly": name in readonly_fields,
				"defer": name in defer,
				"value": getattr(obj, name) if obj is not None else getattr(obj, db_field.column)
			}

			# IngeterField and CharField
			for key in ["min_value", "max_value", "min_length", "max_length"]:
				if hasattr(formfield, key):
					field[key] = getattr(formfield, key)

			if isinstance(db_field, ForeinKey):
				field["related_url"] = "%s/%s" % (opts.app_label, opts.module_name)
				qs = formfield.queryset
				if obj is not None and isinstance(db_field, TreeForeinKey) and db_field.rel.to == model_cls:
					qs = qs.exclude(
						tree_id = obj.tree_id,
						lft_gte = obj.lft,
						right_lte = obj.right,
					)
				if name not in defer:
					rels = queryset.all()
					objs = [{"id": rel.id, "title": unicode(rel)} for rel in rels]
					field["choices"] = objs
			elif hasattr(formfield, "choices"):
				field["choices"] = formfield.choices

			json_fields_dict[name] = field


		for name in names:
			# name is a field
			if not isinstance(name, 'basestring'):
				name = nam

			formfield = fields_dict[name]
			field = {
				"name": name,
				"type": formfield.__class__.__name__,
				"readonly": name in readonly_fields,
				"defer": name in defer,
			}
			for key in ["min_value", "max_value", "min_length", "max_length"]:
				if hasattr(formfield, key):
					field[key] = getattr(formfield, key)

			queryset = getattr(formfield, "queryset", None)
			if queryset is not None:
				opts = queryset.model._meta
				field["related_url"] = "%s/%s" % (opts.app_label, opts.module_name)

				if name not in defer:
					rels = queryset.all()
					objs = [{"id": rel.id, "title": unicode(rel)} for rel in rels]
					field["choices"] = objs

			fields_list.append(field)
		return fields_list

	def _get_fields(self, fields=None, exclude=None):
		opts = self.model_cls._meta
		fields_dict = {}
		for f in opts.fields + opts.many_to_many:
			if not f.editable:
				continue
			if fields is not None and not f.name in fields:
				continue
			if exclude and f.name in exclude:
				continue

			formfield = f.formfield()
			if formfield:
				fields_dict[f] = formfield

		return fields_dict

class ManageSite(object):

	def __init__(self, name='manage', app_name='manage'):
		self._registry = {}
		self.name = name
		self.app_name = app_name

	def register(self, models, manage_class=None):
		if not manage_class:
			manage_class = ModelManage

		if isinstance(models, ModelBase):
			models = [models]

		registry = self._registry
		for model in models:
			if model._meta.abstract:
				raise ImproperlyConfigured('The model %s is abstract, so it '
					'cannot be registered with manage.' % model.__name__)

			if model in registry:
				raise AlreadyRegistered('The model %s is already registered' % model.__name__)

			registry[model] = manage_class(model, self)

	@property
	def urls(self):
		return self.get_urls(), self.app_name, self.name

	def get_urls(self):
		urlpatterns = patterns('',
			url(r'^$', self.index, name='%s_%s' % (self.name, 'index'))
		)

		for model, model_manage in self._registry.iteritems():
			opts = model_manage.opts
			urlpatterns += patterns('',
				url(r'%s/%s/' % (opts.app_label, opts.module_name),
					include(model_manage.urls))
			)

		return urlpatterns

	def index(self, request):
		return render_to_response("manage/home/index.html", {
			"menus": manage_menus,
		})

manage_menus = [
	{
		"title": _("System"),
		"children": [
			{
				"title": _("Settings"), 
				"url": "settings",
			},
			{
				"title": _("File Manage"), 
				"url": "file_manage",
			},
			{
				"title": _("Sites"),
				"url": "sites"
			}
		],
	},
	{
		"title": _("Account"),
		"children": [
			{
				"title": _("User"), 
				"url": "user",
			},
			{
				"title": _("Role"), 
				"url": "role",
			},
			{
				"title": _("Permission"),
				"url": "permission"
			}
		],
	},
	{
		"title": _("Content"),
		"children": [
			{
				"title": _("URL"), 
				"url": "pages/url",
			},
			{
				"title": _("Page"), 
				"url": "pages/page",
			},
		],
	},
	{
		"title": _("Logout"),
		"url": "logout",
		"children": [],
	}
]

site = ManageSite()

