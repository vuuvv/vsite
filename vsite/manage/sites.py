from django import forms
from django.shortcuts import render_to_response
from django.conf.urls import patterns, url, include
from django.db.models.base import ModelBase
from django.db.models import ForeignKey
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
		get_token(request)
		pass

	def delete_view(self, request, object_id):
		get_token(request)
		pass

	def add_view(self, request):
		get_token(request)
		errors = None
		form_validated = True
		msg = "Data Saved"
		obj = None

		opts = self.opts
		model_cls = self.model_cls
		ret = {
			"status": "success",
			"csrf_token": request.META["CSRF_COOKIE"],
			"model_name": model_cls.__name__,
			"app_label": opts.app_label,
			"module_name": opts.module_name,
			"msg": "Data Loaded",
		}

		if request.method == 'POST':
			ModelForm = modelform_factory(model_cls, form=self.form)
			form = ModelForm(request.POST, request.FILES)
			if form.is_valid():
				obj = form.save()
				ret["msg"] = "Data Saved"
				ret["id"] = obj.id
				return render_to_json(ret)
			else:
				ret["status"] = "error"
				ret["msg"] = "Invalid inputs"
				ret["error"] = form.errors
				form_validated = False
				obj = form.data

		ret["fields"] = self._get_client_fields(obj)
		return render_to_json(ret)

	def upadate_view(self, request, object_id):
		get_token(request)
		model_cls = self.model_cls
		try:
			obj = model_cls.objects.get(pk=object_id)
		except model_cls.DoesNotExist:
			return render_to_json({
				"status": "error",
				"msg": "Can't not load this %s" % model_cls.__name__
			})

		errors = None
		form_validated = True
		msg = "Data Updated"

		if request.method == 'POST':
			ModelForm = modelform_factory(self.model_cls, form=self.form)
			form = ModelForm(request.POST, request.FILES, instance=obj)
			if form.is_valid():
				obj = form.save()
				#return render_to_json({"status": "success"})
			else:
				form_validated = False
				obj = form.data
				errors = form.errors
				msg = "Invalid inputs"

		opts = self.opts
		fields_list = self._get_client_fields(obj)
		return render_to_json({
			"status": "success" if form_validated else "error",
			"csrf_token": request.META["CSRF_COOKIE"],
			"model_name": self.model_cls.__name__,
			"app_label": opts.app_label,
			"module_name": opts.module_name,
			"fields": fields_list,
			"hidden_fields": [{
				"name": "id",
				"value": obj.id if form_validated else obj["id"],
			}],
			"errors": errors,
			"msg": msg
		})

	def _get_client_fields(self, obj = None):
		model_cls = self.model_cls
		fields_list = []
		fields_dict = self.fields_dict
		json_fields_dict = {}
		readonly_fields = self.readonly_fields
		defer = self.defer

		for db_field, formfield in self.fields_dict.items():
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
			}
			if obj is not None:
				if is_formdata:
					field["value"] = obj.get(name, None) 
				else:
					field["value"] = getattr(obj, db_field.column) if is_foreignkey else getattr(obj, name)

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
					objs = [{"id": rel.id, "title": unicode(rel)} for rel in rels]
					field["choices"] = objs
			elif hasattr(formfield, "choices"):
				field["choices"] = [{"id": c[0], "title": unicode(c[1])} for c in formfield.choices]
				if obj is None and hasattr(db_field, "default"):
					#default
					field["value"] = db_field.default

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

