from django import forms
from django.shortcuts import render_to_response
from django.conf.urls import patterns, url, include
from django.db.models.base import ModelBase
from django.db.models import ForeignKey, Model
from django.forms.models import modelform_factory
from django.utils.translation import ugettext_lazy as _
from django.shortcuts import _get_queryset
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token

from mptt.models import TreeForeignKey

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
	list_helpers = ('id',)
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
			url(r'^$', self.index, name=''),
			url(r'^p/(?P<page>\d+)/$', self.list_view, name=''),
			url(r'^add/$', self.add_view, name=''),
			url(r'^update/(?P<id>\d+)/$', self.upadate_view, name=''),
			url(r'^delete/$', self.delete_view, name=''),
		)

		return urlpatterns

	def get_models(self, request, **kwargs):
		min_index, max_index = self.get_page_slices(request, **kwargs)
		list_related = self.get_list_related_fields(request)
		return self.model_cls.objects.select_related(*list_related).all()[min_index:max_index]

	def get_column(self, model, attr):
		value = getattr(model, attr)
		if isinstance(value, Model):
			value = unicode(value)
		elif callable(value):
			value = value()
		return value

	def get_columns(self, model, attrs):
		get_column = self.get_column
		return [get_column(model, attr) for attr in attrs]

	def get_columns_dict(self, model, attrs):
		get_column = self.get_column
		return dict([(attr, get_column(model, attr)) for attr in attrs])

	def get_models_list(self, request, **kwargs):
		return [
			{
				"helper": self.get_columns_dict(model, self.list_helpers),
				"fields": self.get_columns(model, self.list_display),
			}
			for model in kwargs.get("models", [])
		]

	def get_list_related_fields(self, request, **kwargs):
		list_related = []
		opts = self.opts
		for item in self.list_display:
			try:
				field = opts.get_field(item)
			except FieldDoesNotExist:
				continue

			if isinstance(field, ForeignKey):
				list_related.append(item)
		return list_related

	def get_page_size(self, request, **kwargs):
		return 20

	def get_page_slices(self, request, **kwargs):
		page_size = self.get_page_size(request)
		page = int(kwargs.get("page", 1))
		return (page - 1) * page_size, page * page_size

	def get_meta_info(self, request, **kwargs):
		opts = self.opts
		return {
			"csrf_token": request.META["CSRF_COOKIE"],
			"model_name": self.model_cls.__name__,
			"app_label": opts.app_label,
			"module_name": opts.module_name,
		}

	def index(self, request, **kwargs):
		return self.list_view(request, **kwargs)

	def list_view(self, request, **kwargs):
		get_token(request)

		resp = self.get_meta_info(request, **kwargs)
		kwargs["resp"] = resp
		models = self.get_models(request, **kwargs)
		resp["columns"] = self.list_display
		resp["models"] = self.get_models_list(request, models=models, **kwargs)

		return render_to_json(resp, "success", "Data Loaded")

	def delete_view(self, request):
		get_token(request)
		ids = [int(id) for id in request.POST.getlist("ids[]")]
		model_cls = self.model_cls
		# have to delete tree node one by one
		for id in ids:
			try:
				obj = model_cls.objects.get(pk=id)
			except model_cls.DoesNotExist:
				pass
			obj.delete()
		return render_to_json({}, "success", "Data Delete")

	def add_view(self, request):
		get_token(request)
		msg = "Data Loaded"
		status = "success"
		obj = None
		model_cls = self.model_cls
		resp = self.get_meta_info(request)

		if request.method == 'POST':
			ModelForm = modelform_factory(model_cls, form=self.form)
			form = ModelForm(request.POST, request.FILES)
			if form.is_valid():
				obj = form.save()
				resp["id"] = obj.id
				return render_to_json(resp, status, "Data Saved")
			else:
				status = "error"
				msg = "Invalid inputs"
				resp["error"] = form.errors
				obj = form.data

		resp["fields"] = self._get_client_fields(obj)
		return render_to_json(resp, status, msg)

	def upadate_view(self, request, **kwargs):
		get_token(request)
		model_cls = self.model_cls
		object_id = kwargs["id"]
		try:
			obj = model_cls.objects.get(pk=object_id)
		except model_cls.DoesNotExist:
			return render_to_json({}, "error", 
				"Can't load this %s" % model_cls.__name__)

		resp = self.get_meta_info(request, **kwargs)
		form_validated = True
		status = "success"
		msg = "Data Loaded"

		if request.method == 'POST':
			ModelForm = modelform_factory(self.model_cls, form=self.form)
			form = ModelForm(request.POST, request.FILES, instance=obj)
			if form.is_valid():
				obj = form.save()
				msg = "Data Updated"
			else:
				form_validated = False
				obj = form.data
				resp["errors"] = form.errors
				msg = "Invalid inputs"

		resp["fields"] = self._get_client_fields(obj)
		resp["hidden_fields"] = [{
				"name": "id",
				"value": obj.id if form_validated else obj["id"],
		}]
		return render_to_json(resp, status, msg)

	def _get_client_fields(self, obj = None):
		model_cls = self.model_cls
		fields_list = []
		json_fields_dict = {}
		readonly_fields = self.readonly_fields
		defer = self.defer

		for db_field, formfield in self.fields_dict.values():
			name = db_field.name
			widget = formfield.widget
			is_foreignkey = isinstance(db_field, ForeignKey)
			# TODO: this should do in the custom model form
			is_treenode = isinstance(db_field, TreeForeignKey) and db_field.rel.to == model_cls
			is_formdata = isinstance(obj, dict)
			field = {
				"name": name,
				"field": formfield.__class__.__name__,
				"widget": widget.__class__.__name__,
				#"validators": [v.__class__.__name__ for v in formfield.validators],
				#"attrs": widget.attrs,
				"readonly": name in readonly_fields,
				"defer": name in defer,
				"label": unicode(db_field.verbose_name),
			}
			if obj is not None:
				if is_formdata:
					field["value"] = obj.get(name, None) 
				else:
					field["value"] = getattr(obj, db_field.column) if is_foreignkey else getattr(obj, name)
			elif db_field.has_default():
				field["value"] = db_field.get_default()

			# IngeterField and CharField
			for key in ["min_value", "max_value", "min_length", "max_length"]:
				if hasattr(formfield, key):
					field[key] = getattr(formfield, key)

			if isinstance(db_field, ForeignKey):
				opts = db_field.rel.to._meta
				field["related_url"] = "%s/%s" % (opts.app_label, opts.module_name)
				qs = formfield.queryset
				if obj is not None and is_treenode and not is_formdata:
					qs = qs.exclude(
						tree_id = obj.tree_id,
						lft__gte = obj.lft,
						rght__lte = obj.rght,
					)
				if name not in defer:
					rels = qs.all()
					objs = [{"id": "", "title": "---------"}]
					for rel in rels:
						objs.append({"id": rel.id, "title": unicode(rel)});
					field["choices"] = objs
			elif hasattr(formfield, "choices"):
				field["choices"] = [{"id": c[0], "title": unicode(c[1])} for c in formfield.choices]

			json_fields_dict[name] = field

		fields_name = self.fields
		if fields_name is None:
			return json_fields_dict.values()
		else:
			for name in fields_name:
				fields_list.append(json_fields_dict[name])

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
				fields_dict[f.name] = (f, formfield)

		return fields_dict

class TreeModelManage(ModelManage):
	list_helpers = ("id", "is_leaf_node")

	def get_urls(self):
		urlpatterns = patterns('',
			url(r'^(?P<id>\d+)/$', self.index, name=''),
			url(r'^(?P<id>\d+)/p/(?P<page>\d+)/$', self.list_view, name=''),
		)
		urlpatterns += super(TreeModelManage, self).get_urls()

		return urlpatterns

	def index(self, request, **kwargs):
		return self.list_view(request, **kwargs)

	def get_models(self, request, **kwargs):
		object_id = kwargs.get("id", None)
		min_index, max_index = self.get_page_slices(request, **kwargs)
		list_related = self.get_list_related_fields(request)
		manager = self.model_cls.objects
		resp = kwargs["resp"]
		if object_id is None:
			resp["ancestors"] = []
			return manager.select_related(*list_related).filter(
				parent_id = None
			)[min_index:max_index]
		else: 
			obj = manager.get(pk=object_id)
			resp["ancestors"] = [(o.id, o.title) for o in obj.get_ancestors()]
			return manager.select_related(*list_related).filter(
				tree_id = obj.tree_id,
				parent_id = obj.id,
			)[min_index:max_index]

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
			url(r'^$', self.index, name='%s_%s' % (self.name, 'index')),
			url(r'^upload/$', self.upload, name='%s_%s' % (self.name, 'upload'))
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

	def upload(self, request):
		render_to_response({});

manage_menus = [
	{
		"title": _("System"),
		"children": [
			{
				"title": _("Settings"), 
				"attrs": {
					"href": "#settings",
				}
			},
			{
				"title": _("File Manage"), 
				"attrs": {
					"class": "cmd",
					"cmd": "file_manage",
					"href": "javascript:void(0)",
				}
			},
			{
				"title": _("Sites"),
				"attrs": {
					"href": "#sites",
				}
			}
		],
	},
	{
		"title": _("Account"),
		"children": [
			{
				"title": _("User"), 
				"attrs": {
					"href": "#user",
				}
			},
			{
				"title": _("Role"), 
				"attrs": {
					"href": "#role",
				}
			},
			{
				"title": _("Permission"),
				"attrs": {
					"href": "#permission",
				}
			}
		],
	},
	{
		"title": _("Content"),
		"children": [
			{
				"title": _("URL"), 
				"attrs": {
					"href": "#pages/url",
				}
			},
			{
				"title": _("Page"), 
				"attrs": {
					"href": "#pages/page",
				}
			},
		],
	},
	{
		"title": _("Logout"),
		"attrs": {
			"href": "#logout",
		},
		"children": [],
	}
]

site = ManageSite()

