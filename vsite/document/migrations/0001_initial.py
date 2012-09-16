# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'Article'
        db.create_table('document_article', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('site', self.gf('django.db.models.fields.related.ForeignKey')(related_name='articles', to=orm['sites.Site'])),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(related_name='articles', to=orm['users.User'])),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('sub_title', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('_from', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('author', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('is_draft', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('content', self.gf('vsite.core.fields.RichTextField')()),
            ('date_created', self.gf('django.db.models.fields.DateTimeField')(default=datetime.datetime(2012, 9, 15, 17, 42, 48, 351000))),
        ))
        db.send_create_signal('document', ['Article'])


    def backwards(self, orm):
        
        # Deleting model 'Article'
        db.delete_table('document_article')


    models = {
        'document.article': {
            'Meta': {'object_name': 'Article'},
            '_from': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'author': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'content': ('vsite.core.fields.RichTextField', [], {}),
            'date_created': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2012, 9, 15, 17, 42, 48, 354000)'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_draft': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'articles'", 'to': "orm['sites.Site']"}),
            'sub_title': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'articles'", 'to': "orm['users.User']"})
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
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2012, 9, 15, 17, 42, 48, 355000)'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2012, 9, 15, 17, 42, 48, 354000)'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'roles': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['users.Role']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        }
    }

    complete_apps = ['document']
