from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _

HONOR_ROOT = settings.UPLOAD_ROOT + 'honor/'
HONOR_THUMB_ROOT = HONOR_ROOT + 'thumb/'

class Category(models.Model):
	name = models.CharField(_("Category"), max_length=50)
	slug = models.CharField(_("slug"), max_length=50, blank=True)
	ordering = models.IntegerField(_("Ordering"), default=1000) 

	class Meta:
		ordering = ("ordering", )

	def __unicode__(self):
		return self.name

	def save(self, *args, **kwargs):
		if self.slug is None:
			self.slug = self.name.lower()
		super(Category, self).save(*args, **kwargs)

class Honor(models.Model):
	category = models.ForeignKey(Category, verbose_name=_("Category"), related_name="honors")
	name = models.CharField(_("Honor"), max_length=50)
	description = models.TextField(_("Description"), blank=True)
	image = models.ImageField(_("Image"), upload_to=HONOR_ROOT, blank=True)
	thumbnail = models.ImageField(_("Thumbnail"), upload_to=HONOR_THUMB_ROOT, blank=True)
	ordering = models.IntegerField(_("Ordering"), default=1000) 
	active = models.BooleanField(_("Active"), default=True)

	class Meta:
		ordering = ("ordering", )

	def __unicode__(self):
		return self.name

	def save(self, *args, **kwargs):
		super(Honor, self).save(*args, **kwargs)
		if self.image and not self.thumbnail:
			basename = os.path.basename(self.image.path)
			img = make_thumb(os.path.join(settings.MEDIA_ROOT, self.image.name), 215, 143)
			path = os.path.join(settings.MEDIA_ROOT, HONOR_THUMB_ROOT, basename)
			img.save(filename=path)
			self.thumbnail = HONOR_THUMB_ROOT + basename
			super(Honor, self).save(*args, **kwargs)
