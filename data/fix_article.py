import os
from django.conf import settings
from pyquery import PyQuery

def fix_img(index, elem):
	q = PyQuery(elem)
	src = q.attr("src")
	filename = os.path.basename(src)
	q.attr("src", "%s%s" % (settings.MEDIA_URL, filename))

def fix(html):
	q = PyQuery(html)
	q('img').map(fix_img)
	return q.html()

from vsite.press.models import Press

press = Press.objects.all()[0]

press.content = fix(press.content)
press.save()

