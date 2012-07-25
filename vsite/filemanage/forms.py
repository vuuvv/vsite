import os

from django import forms
from django.core.files.storage import default_storage
from django.core.exceptions import ValidationError

class UploadFileForm(forms.Form):
	path = forms.CharField(max_length=200, required=False)
	Filename = forms.CharField(max_length=50)
	Filedata = forms.FileField()

	def save(self):
		data = self.cleaned_data
		path = data["path"]
		filename = data["Filename"]
		filepath = os.path.join(path.strip("/"), filename)
		file = data["Filedata"]
		default_storage.save(filepath, file)
		return path, filename

class NewFoldForm(forms.Form):
	path = forms.CharField(max_length=200, required=False)
	name = forms.CharField(max_length=50)

	def clean(self):
		data = self.cleaned_data
		path = data["path"]
		name = data["name"]
		folderpath = os.path.join(path.strip("/"), name)
		full_path = default_storage.path(folderpath)
		if os.path.exists(full_path):
			raise ValidationError(u"Directory '%s' exists!" % folderpath)
		data["full_path"] = full_path
		return data

	def save(self):
		data = self.cleaned_data
		os.makedirs(data["full_path"])
		return data["path"], data["name"]

class RenameForm(forms.Form):
	path = forms.CharField(max_length=200, required=False)
	name = forms.CharField(max_length=50)
	new_name = forms.CharField(max_length=50)

	def clean(self):
		#TODO: check the permission
		data = self.cleaned_data
		path = data["path"].strip("/")
		name = data["name"]
		new_name = data["new_name"]
		file_path = os.path.join(path, name)
		new_file_path = os.path.join(path, new_name)
		full_path = default_storage.path(file_path)
		full_new_path = default_storage.path(new_file_path)

		if not os.path.exists(full_path):
			raise ValidationError(u"'%s' not exist!" % file_path)
		if os.path.exists(full_new_path):
			raise ValidationError(u"Can't rename: '%s' already exist!" % new_file_path)
		data["full_path"] = full_path
		data["full_new_path"] = full_new_path
		return data

	def save(self):
		data = self.cleaned_data

		src = data["full_path"]
		dst = data["full_new_path"]
		os.rename(src, dst)
		return data["name"], data["new_name"]

