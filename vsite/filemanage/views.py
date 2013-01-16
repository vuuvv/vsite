from django.http import HttpResponse
from django.shortcuts import render_to_response

from .forms import UploadFileForm

def index(request):
    return HttpResponse("Hello World")

def upload(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return HttpResponse("upload success")
        else:
            return HttpResponse("upload failed")
    else:
        form = UploadFileForm()
    return render_to_response("filemanage/upload.html", {"form": form})

