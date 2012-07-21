import re
import unicodedata

from django.utils.encoding import smart_unicode

def slugify(s):
	chars = []
	for c in smart_unicode(s):
		cat = unicodedata.category(c)[0]
		if cat in "LN" or c in "-_~":
			chars.append(c)
		elif cat == "Z":
			chars.append(" ")
	return re.sub("[-\s]+", "-", "".join(chars).strip()).lower()
