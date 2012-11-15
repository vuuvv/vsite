import os
from datetime import datetime

from wand.image import Image

from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.contrib.sites.models import Site
from django.db.transaction import commit_on_success

from mptt.models import MPTTModel, TreeForeignKey

from vsite.core.fields import RichTextField
from vsite.core.models import MetaData


PRODUCT_ROOT = settings.UPLOAD_ROOT + 'product/'
PRODUCT_THUMB_ROOT = PRODUCT_ROOT + 'thumb/'
PRODUCT_CATEGORY_ROOT = PRODUCT_ROOT + 'category/'
PRODUCT_TECHNOLOGY_ROOT = PRODUCT_ROOT + 'technology/'
CATEGORY_BANNER_ROOT = PRODUCT_CATEGORY_ROOT + 'banner/'
CATEGORY_FEATURE_ROOT = PRODUCT_CATEGORY_ROOT + 'feature/'
STYLE_ROOT = PRODUCT_ROOT + 'style/'
STYLE_THUMB_ROOT = STYLE_ROOT + 'thumb/'

def make_thumb(path, width=160, height=120):
    img = Image(filename=path).clone()
    w, h= img.width, img.height

    if w > width or h > height:
        img.resize(width, height)
    return img

class Category(MPTTModel):
    site = models.ForeignKey(Site, related_name="categories", verbose_name=_("Site"))
    name = models.CharField(_("Name"), max_length=100)
    slug = models.CharField(_("Slug"), max_length=100, blank=True, null=True)
    description = models.TextField(_("Description"), blank=True)
    image = models.ImageField(_("Image"), blank=True, upload_to=PRODUCT_CATEGORY_ROOT)
    feature_image = models.ImageField(_("Feature Image"), blank=True, upload_to=CATEGORY_FEATURE_ROOT)
    parent = TreeForeignKey('self', null=True, blank=True, verbose_name=_('Parent'))
    meta_keywords = models.TextField(_("Meta keywords"), blank=True)
    meta_description = models.TextField(_("Meta description"), blank=True)
    active = models.BooleanField(_("Active"), default=True)
    cached_url = models.CharField(_('URL'), max_length=255, blank=True, editable=False, default='', db_index=True)

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    def __init__(self, *args, **kwargs):
        super(Category, self).__init__(*args, **kwargs)
        self._originalcached_url = self.cached_url

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name

    @property
    def banner(self):
        banner = {
            "images": [],
            "desc": self.description,
            "name": self.name,
        }
        images = self.banner_images.all()
        if not images and not self.is_root_node():
            return self.parent.banner
        banner["images"] = images
        return banner

    @commit_on_success
    def save(self, *args, **kwargs):
        if self.slug is None:
            self.slug = self.name.lower()

        cached_page_urls = {}

        if self.is_root_node():
            if self.slug:
                self.cached_url = u'/%s/' % self.slug
            else:
                self.cached_url = u'/'
        else:
            self.cached_url = u'%s%s/' % (self.parent.cached_url, self.slug)

        super(Category, self).save(*args, **kwargs)
        if self.is_leaf_node() or self.cached_url == self._originalcached_url:
            return

        descendants = self.get_descendants()

        stack = [self]
        last_page = self
        for node in descendants:
            parent = stack[-1]
            # child node
            if node.rght < last_page.rght:
                stack.append(last_page)
                parent = last_page
            else:
                # tree up
                while node.rght > parent.rght:
                    stack.pop()
                    parent = stack[-1]

            node.cached_url = u'%s%s/' % (parent.cached_url, node.slug)
            super(Category, node).save()
            last_page = node

    @models.permalink
    def get_absolute_url(self):
        return ('product_category', (self.cached_url.strip("/"),), {})

class Technology(models.Model):
    name = models.CharField(_("Name"), max_length=50)
    description = models.TextField(_("Description"), blank=True)
    image = models.ImageField(_("Image"), blank=True, upload_to=PRODUCT_TECHNOLOGY_ROOT)

    def __unicode__(self):
        return self.name

class Product(MetaData):
    categories = models.ManyToManyField(Category, verbose_name=_("Category"), related_name="products")
    sku = models.CharField(_("sku"), max_length=50)
    name = models.CharField(_("Name"), max_length=50, blank=True)
    slug = models.SlugField(_("Slug"), unique=True, blank=True)
    image = models.ImageField(_("Image"), upload_to=PRODUCT_ROOT, blank=True)
    thumbnail = models.ImageField(_("Thumbnail"), upload_to=PRODUCT_THUMB_ROOT, blank=True)

    summary = RichTextField(_("Summary"))
    assembly = RichTextField(_("Assembly"), blank=True)
    manual = RichTextField(_("Manual"), blank=True)
    technologies = models.ManyToManyField(Technology, verbose_name=_("Technology"), related_name="products", blank=True)

    ordering = models.IntegerField(_("Ordering"), default=1000)

    tags = models.CharField(_("Tags"), max_length=100, blank=True)
    active = models.BooleanField(_("Active"), default=True)
    creation_date = models.DateTimeField(_("Creation date"), auto_now_add=True)

    class Meta:
        verbose_name = _("Product")
        verbose_name_plural = _("Product")
        ordering = ("ordering",)

    def __unicode__(self):
        return "%s(%s)" % (self.sku, self.name)

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.sku
        if not self.slug:
            self.slug = self.sku
        self.slug = self.slug.lower()
        # handle thumb
        super(Product, self).save(*args, **kwargs)
        if self.image and not self.thumbnail:
            basename = os.path.basename(self.image.path)
            img = make_thumb(os.path.join(settings.MEDIA_ROOT, self.image.name), 215, 143)
            path = os.path.join(settings.MEDIA_ROOT, PRODUCT_THUMB_ROOT, basename)
            img.save(filename=path)
            self.thumbnail = PRODUCT_THUMB_ROOT + basename
            super(Product, self).save(*args, **kwargs)

    def get_categories(self):
        return self.categories.all()

    @property
    def tag_list(self):
        return [t.strip() for t in self.tags.split(",")]

    @models.permalink
    def get_absolute_url(self):
        return ('product_detail', (self.slug,), {})

class PropertyKey(models.Model):
    name = models.CharField(_("Name"), max_length=50)
    description = models.TextField(_("Description"), blank=True)

    class Meta:
        ordering = ("name",)

    def __unicode__(self):
        return u"%s" % self.name

class Property(models.Model):
    product = models.ForeignKey(Product, verbose_name=_("Product"), related_name="properties")
    key = models.ForeignKey(PropertyKey, verbose_name=_("Property Key"), related_name="properties")
    value = models.CharField(_("Value"), max_length=50)
    description = models.TextField(_("Description"), blank=True)

    class Meta:
        verbose_name = _("Property")
        verbose_name_plural = _("properties")
        ordering = ("key__name",)

    def __unicode__(self):
        return u"%s:%s" % (self.key, self.value)

class StyleCategory(MetaData):
    name = models.CharField(_("Name"), max_length=100)
    slug = models.CharField(_("Slug"), max_length=100, blank=True, null=True)
    active = models.BooleanField(_("Active"), default=True)

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.name:
            self.slug = self.name.lower()
        super(StyleCategory, self).save(*args, **kwargs)

    @models.permalink
    def get_absolute_url(self):
        return ('style_category', (self.slug,), {})

class Style(MetaData):
    category = models.ForeignKey(StyleCategory, verbose_name=_("Category"), related_name="styles")
    name = models.CharField(_("Name"), max_length=100)
    slug = models.CharField(_("Slug"), max_length=100, blank=True, null=True)
    ordering = models.IntegerField(_("Order"), default=999)
    active = models.BooleanField(_("Active"), default=True)
    summary = models.TextField(_("Summary"), blank=True)

    introduce = RichTextField(_("Introduce"), blank=True)
    technologies = models.ManyToManyField(Technology, verbose_name=_("Technology"), related_name="styles")
    products = models.ManyToManyField(Product, verbose_name=_("Product"), related_name="styles")

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.name:
            self.slug = self.name.lower()
        super(Style, self).save(*args, **kwargs)

    @models.permalink
    def get_absolute_url(self):
        return ('style_detail', (self.slug,), {})

class StyleImage(models.Model):
    image = models.ImageField(_("Image"), upload_to=STYLE_ROOT, blank=True)
    thumbnail = models.ImageField(_("Thumbnail"), upload_to=STYLE_THUMB_ROOT, blank=True)
    style = models.ForeignKey(Style, verbose_name=_("Style"), related_name="images")

    def __unicode__(self):
        return self.image.url

    def save(self, *args, **kwargs):
        super(StyleImage, self).save(*args, **kwargs)
        if self.image:
            basename = os.path.basename(self.image.path)
            img = make_thumb(os.path.join(settings.MEDIA_ROOT, self.image.name), 300, 200)
            path = os.path.join(settings.MEDIA_ROOT, STYLE_THUMB_ROOT, basename)
            img.save(filename=path)
            self.thumbnail = STYLE_THUMB_ROOT + basename
            super(StyleImage, self).save(*args, **kwargs)

class BannerImage(models.Model):
    image = models.ImageField(_("Image"), upload_to=CATEGORY_BANNER_ROOT, blank=True)
    category = models.ForeignKey(Category, verbose_name=_("Category"), related_name="banner_images")

    def __unicode__(self):
        return self.image.url

