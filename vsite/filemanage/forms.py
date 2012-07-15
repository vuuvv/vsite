import os

from django import forms
from django.core.files.storage import default_storage

class UploadFileForm(forms.Form):
	path = forms.CharField(max_length=200)
	Filename = forms.CharField(max_length=50)
	Filedata = forms.FileField()

	def save(self):
		if self.is_valid():
			data = self.cleaned_data
			path = os.path.join(data["path"].strip("/"), data["Filename"])
			file = data["Filedata"]
			default_storage.save(path, file)
