from django import forms

class UploadFileForm(forms.Form):
	path = forms.CharField(max_length=200)
	filename = forms.CharField(max_length=50)
	file = forms.FileField()
