# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'MagzineImage'
        db.create_table('press_magzineimage', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('page', self.gf('django.db.models.fields.IntegerField')(blank=True)),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100)),
            ('magzine', self.gf('django.db.models.fields.related.ForeignKey')(related_name='images', to=orm['press.Magzine'])),
            ('active', self.gf('django.db.models.fields.BooleanField')(default=True)),
        ))
        db.send_create_signal('press', ['MagzineImage'])

        # Adding model 'Magzine'
        db.create_table('press_magzine', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('gen_description', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('keywords', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('slug', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('ordering', self.gf('django.db.models.fields.IntegerField')(blank=True)),
        ))
        db.send_create_signal('press', ['Magzine'])

        # Changing field 'Press.press_from'
        db.alter_column('press_press', 'press_from', self.gf('django.db.models.fields.CharField')(max_length=200, null=True))

        # Changing field 'Press.summary'
        db.alter_column('press_press', 'summary', self.gf('django.db.models.fields.TextField')(max_length=100, null=True))

        # Changing field 'Press.thumbnail'
        db.alter_column('press_press', 'thumbnail', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True))


    def backwards(self, orm):
        
        # Deleting model 'MagzineImage'
        db.delete_table('press_magzineimage')

        # Deleting model 'Magzine'
        db.delete_table('press_magzine')

        # Changing field 'Press.press_from'
        db.alter_column('press_press', 'press_from', self.gf('django.db.models.fields.TextField')(max_length=200, null=True))

        # Changing field 'Press.summary'
        db.alter_column('press_press', 'summary', self.gf('django.db.models.fields.CharField')(max_length=100, null=True))

        # Changing field 'Press.thumbnail'
        db.alter_column('press_press', 'thumbnail', self.gf('vsite.core.fields.ImageField')(max_length=200, null=True))


    models = {
        'press.magzine': {
            'Meta': {'ordering': "('ordering',)", 'object_name': 'Magzine'},
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'gen_description': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'keywords': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'ordering': ('django.db.models.fields.IntegerField', [], {'blank': 'True'}),
            'slug': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'press.magzineimage': {
            'Meta': {'ordering': "('page',)", 'object_name': 'MagzineImage'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'magzine': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'images'", 'to': "orm['press.Magzine']"}),
            'page': ('django.db.models.fields.IntegerField', [], {'blank': 'True'})
        },
        'press.press': {
            'Meta': {'ordering': "('-publish_date',)", 'object_name': 'Press'},
            'author': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'category': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'press'", 'to': "orm['press.PressCategory']"}),
            'content': ('vsite.core.fields.RichTextField', [], {'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'gen_description': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'keywords': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'press_from': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'publish_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'sub_title': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'summary': ('django.db.models.fields.TextField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'tags': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'thumbnail': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'press'", 'null': 'True', 'to': "orm['users.User']"})
        },
        'press.presscategory': {
            'Meta': {'object_name': 'PressCategory'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'press_categories'", 'to': "orm['sites.Site']"}),
            'slug': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'})
        },
        'sites.site': {
            'Meta': {'ordering': "('domain',)", 'object_name': 'Site', 'db_table': "'django_site'"},
            'domain': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'users.role': {
            'Meta': {'object_name': 'Role'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'})
        },
        'users.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2012, 9, 22, 21, 34, 28, 517000)'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2012, 9, 22, 21, 34, 28, 517000)'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'roles': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['users.Role']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        }
    }

    complete_apps = ['press']
