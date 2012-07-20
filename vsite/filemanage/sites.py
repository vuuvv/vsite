from os import path as ospath
from django.conf.urls.defaults import patterns, url, include
from django.core.files.storage import default_storage
from django.core.exceptions import PermissionDenied

from vsite.utils import render_to_json

from .forms import UploadFileForm

class FileManageSite(object):
	def __init__(self, name='filemanage', app_name='filemanage', storage=default_storage):
		self.name = name
		self.app_name = app_name
		self.storage = storage

	@property
	def urls(self):
		return self.get_urls(), self.app_name, self.name

	def get_urls(self):
		urlpatterns = patterns('',
			url(r'upload/$', self.upload, name=''),
			url(r'^browse/(?P<path>(.*))$', self.browse, name=''),
		)

		return urlpatterns;

	def browse(self, request, path):
		storage = self.storage
		dirs, files = storage.listdir(path)

		dirs_info = [{
			"name": d, 
			"mtime": storage.modified_time(ospath.join(path, d)),
		} for d in dirs]

		files_info = [{
			"name": f, 
			"mtime": storage.modified_time(ospath.join(path, f)),
			"size": storage.size(ospath.join(path, f)),
		} for f in files]

		return render_to_json({
			"current_path": path,
			"files": files_info,
			"dirs": dirs_info,
		}, "success", "directory %s info loaded" % path)

	def upload(self, request):
		if request.method == 'POST':
			form = UploadFileForm(request.POST, request.FILES)
			if form.is_valid():
				form.save()
				return render_to_json({}, "success", "File uploaded")
			else:
				return render_to_json({}, "error", "invalid files")
		else:
			raise PermissionDenied()



site = FileManageSite()
