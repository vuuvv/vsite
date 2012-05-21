from django.db import models
from django.utils.translation import ugettext_lazy as _

from django.contrib.auth.hashers import (
	check_password, make_password, is_password_usable, UNUSABLE_PASSWORD)

class ViewPermission(models.Model):
	view = models.CharField(_('name'), max_length=50)

class Role(models.Model):
	name = models.CharField(_('name'), max_length=80, unique=True)
	permissions = models.ManyToManyField(ViewPermission,
			verbose_name=_('permissions'), blank=True)

	class Meta:
		verbose_name = _('group')
		verbose_name_plural = _('groups')

	def __unicode__(self):
		return self.name

	def natural_key(self):
		return (self.name,)

class User(models.Model):
	username = models.CharField(_('username'), max_length=30, unique=True,
		help_text=_('Required. 30 characters or fewer. Letters, numbers and '
					'@/./+/-/_ characters'))
	email = models.EmailField(_('e-mail address'), blank=True)
	password = models.CharField(_('password'), max_length=128)
	is_active = models.BooleanField(_('active'), default=True,
		help_text=_('Designates whether this user should be treated as '
					'active. Unselect this instead of deleting accounts.'))
	last_login = models.DateTimeField(_('last login'), default=timezone.now)
	date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
	groups = models.ManyToManyField(Group, verbose_name=_('groups'),
		blank=True, help_text=_('The groups this user belongs to. A user will '
								'get all permissions granted to each of '
								'his/her group.'))
	user_permissions = models.ManyToManyField(Permission,
		verbose_name=_('user permissions'), blank=True,
		help_text='Specific permissions for this user.')
 
	class Meta:
		verbose_name = _('user')
		verbose_name_plural = _('users')

	def __unicode__(self):
		return self.username

	def natural_key(self):
		return (self.username,)

	def is_anonymous(self):
		return False

	def set_password(self, raw_password):
		self.password = make_password(raw_password)

	def check_password(self, raw_password):
		def setter(raw_password):
			self.set_password(raw_password)
			self.save()
		return check_password(raw_password, self.password, setter)

