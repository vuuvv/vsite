import os
import errno
import shutil
from os import path as ospath

from django.conf.urls.defaults import patterns, url, include
from django.core.files.storage import default_storage
from django.core.exceptions import PermissionDenied

from vsite.utils import render_to_json

from .forms import UploadFileForm, NewFoldForm

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
			url(r'^upload/$', self.upload, name=''),
			url(r'^newfolder/$', self.new_folder, name=''),
			url(r'^delete/$', self.delete, name=''),
			url(r'^browse/(?P<path>(.*))$', self.browse, name=''),
		)

		return urlpatterns;

	def get_file_info(self, path, name, storage):
		path = ospath.join(path, name)
		return {
			"name": name, 
			"mtime": storage.modified_time(path),
			"size": storage.size(path),
		}

	def get_folder_info(self, path, name, storage):
		return {
			"name": name,
			"mtime": storage.modified_time(ospath.join(path, name))
		}

	def browse(self, request, path):
		storage = self.storage
		folders, files = storage.listdir(path)

		folders_info = [self.get_folder_info(path, name, storage) for name in folders]
		files_info = [self.get_file_info(path, name, storage) for name in files]

		return render_to_json({
			"current_path": path,
			"files": files_info,
			"folders": folders_info,
		}, "success", "directory %s info loaded" % path)

	def new_folder(self, request):
		if request.method == 'POST':
			form = NewFoldForm(request.POST)
			if form.is_valid():
				path, name = form.save()
				return render_to_json({
					"folder": self.get_folder_info(path, name, self.storage)
				}, "success", "Folder Created")
			else:
				return render_to_json({
					"errors": form.errors,
				}, "error", "Create Folder Failed") 
		else:
			raise PermissionDenied()

	def delete(self, request):
		if request.method == 'POST':
			current_path = request.POST['path']
			files = request.POST.getlist('files[]')
			deletes = []
			not_deletes = []
			for file in files:
				path = ospath.join(current_path.strip("/"), file)
				path = default_storage.path(path)
				if ospath.exists(path):
					try:
						if ospath.isdir(path):
							shutil.rmtree(path)
						else:
							os.remove(path)
						deletes.append(file)
					except OSError, e:
						if e.errno == errno.ENOENT:
							deletes.append(file)
						not_deletes.append(file)

			return render_to_json({
				"files": deletes,
				"errors": not_deletes,
			}, "success", "Files Deleted")
		else:
			raise PermissionDenied

	def upload(self, request):
		if request.method == 'POST':
			form = UploadFileForm(request.POST, request.FILES)
			if form.is_valid():
				path, name = form.save()
				return render_to_json({
					"file": self.get_file_info(path, name, self.storage),
					"current_path": path,
				}, "success", "File Uploaded")
			else:
				return render_to_json({
					"errors": form.errors,
				}, "error", "Invalid Files")
		else:
			raise PermissionDenied()



site = FileManageSite()
