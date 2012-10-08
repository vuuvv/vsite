from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _

from mptt.models import MPTTModel, TreeForeignKey

class Area(MPTTModel):
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children', verbose_name=_('Parent'))
    name = models.CharField(_('Title'), max_length=50)

    def __unicode__(self):
        return self.name

    def get_dealers(self):
        pass

class Dealer(models.Model):
    area = TreeForeignKey(Area, related_name="dealears")
    name = models.CharField(_("Name"), max_length=50)
    address = models.CharField(_("Address"), max_length=100, blank=True)
    contact = models.CharField(_("Contact"), max_length=50, blank=True)
    tel = models.CharField(_("Telephone"), max_length=25, blank=True)
    mobile = models.CharField(_("Mobile"), max_length=25, blank=True)
    fax = models.CharField(_("Fax"), max_length=25, blank=True)
    website = models.CharField(_("Website"), max_length=100, blank=True)
    zipcode = models.CharField(_("Zipcode"), max_length=50, blank=True)
    latitude = models.CharField(_("Latitude"), max_length=50, blank=True)
    longitude = models.CharField(_("Longitude"), max_length=50, blank=True)
    active = models.BooleanField(_("Active"), default=True)

    class Meta:
        ordering = ("name", )

    def __unicode__(self):
        return self.name

