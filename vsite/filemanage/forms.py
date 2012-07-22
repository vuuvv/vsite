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

class DeleteForm(forms.Form):
	path = forms.CharField(max_length=200, required=False)
