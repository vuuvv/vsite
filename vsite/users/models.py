from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.utils.crypto import get_random_string
from django.utils import timezone

from django.contrib.auth.hashers import (
	check_password, make_password, is_password_usable, UNUSABLE_PASSWORD)

from .signals import user_logged_in

def update_last_login(sender, user, **kwargs):
	user.last_login = timezone.now()
	user.save()
user_logged_in.connect(update_last_login);

#class ViewPermission(models.Model):
#	view = models.CharField(_('name'), max_length=50)

class RoleManager(models.Manager):
	def get_by_natural_key(self, name):
		return self.get(name=name)

class Role(models.Model):
	name = models.CharField(_('name'), max_length=80, unique=True)
#	permissions = models.ManyToManyField(ViewPermission,
#			verbose_name=_('permissions'), blank=True)

	class Meta:
		verbose_name = _('group')
		verbose_name_plural = _('groups')

	def __unicode__(self):
		return self.name

	def natural_key(self):
		return (self.name,)

class UserManager(models.Manager):
	@classmethod
	def normalize_email(cls, email):
		email = email or ''
		try:
			email_name, domain_part = email.strip().rsplit('@', 1)
		except ValueError:
			pass
		else:
			email = '@'.join([email_name, domain_part.lower()])
		return email

	def create_user(self, username, email=None, password=None):
		now = timezone.now()
		if not username:
			raise ValueError('The given username must be set')
		email = UserManager.normalize_email(email)
		user = self.model(username=username, email=email, is_active=True,
				last_login=now, date_joined=now)
		user.set_password(password)
		user.save(using=self._db)
		return user

class User(models.Model):
	username = models.CharField(_('username'), max_length=30, unique=True,
		help_text=_('Required. 30 characters or fewer. Letters, numbers and '
					'@/./+/-/_ characters'))
	email = models.EmailField(_('e-mail address'), blank=True)
	password = models.CharField(_('password'), max_length=128)
	is_active = models.BooleanField(_('active'), default=True,
		help_text=_('Designates whether this user should be treated as '
					'active. Unselect this instead of deleting accounts.'))
	is_superuser = models.BooleanField(_('superuser'), default=False,
		help_text=_('Designates whether the user has all permissions without '
			'explicityly assigning them'))
	last_login = models.DateTimeField(_('last login'), default=timezone.now)
	date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
	roles = models.ManyToManyField(Role, verbose_name=_('role'),
		blank=True, help_text=_('The groups this user belongs to. A user will '
								'get all permissions granted to each of '
								'his/her group.'))
#	user_permissions = models.ManyToManyField(Permission,
#		verbose_name=_('user permissions'), blank=True,
#		help_text='Specific permissions for this user.')
 
	class Meta:
		verbose_name = _('user')
		verbose_name_plural = _('users')

	def __unicode__(self):
		return self.username

	def natural_key(self):
		return (self.username,)

	def is_anonymous(self):
		return False

	def is_authenticated(self):
		return True

	def set_password(self, raw_password):
		self.password = make_password(raw_password)

	def check_password(self, raw_password):
		def setter(raw_password):
			self.set_password(raw_password)
			self.save()
		return check_password(raw_password, self.password, setter)

	def set_unusable_password(self):
		self.password = make_password(None)

	def has_perm(self, perm, obj=None):
		if self.is_active and self.is_superuser:
			return True
		return False

class AnonymousUser(object):
	id = None
	username = ''


from vsite.manage.sites import site, ModelManage

class UserManage(ModelManage):
	fields = ("username", "email", "is_active", "is_superuser")
	list_display = ("username", "email", "date_joined")
	readonly_fields = ()

site.register(User, UserManage)

