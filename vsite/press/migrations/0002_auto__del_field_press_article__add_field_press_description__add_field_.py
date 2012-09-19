# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Press.article'
        db.delete_column('press_press', 'article_id')

        # Adding field 'Press.description'
        db.add_column('press_press', 'description',
                      self.gf('django.db.models.fields.TextField')(default='', blank=True),
                      keep_default=False)

        # Adding field 'Press.gen_description'
        db.add_column('press_press', 'gen_description',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Press.keywords'
        db.add_column('press_press', 'keywords',
                      self.gf('django.db.models.fields.TextField')(default='', blank=True),
                      keep_default=False)

        # Adding field 'Press.user'
        db.add_column('press_press', 'user',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='press', null=True, to=orm['users.User']),
                      keep_default=False)

        # Adding field 'Press.sub_title'
        db.add_column('press_press', 'sub_title',
                      self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Press.author'
        db.add_column('press_press', 'author',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Press._from'
        db.add_column('press_press', '_from',
                      self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Press.content'
        db.add_column('press_press', 'content',
                      self.gf('vsite.core.fields.RichTextField')(null=True, blank=True),
                      keep_default=False)


        # Changing field 'Press.title'
        db.alter_column('press_press', 'title', self.gf('django.db.models.fields.CharField')(default=111, max_length=100))

    def backwards(self, orm):
        # Adding field 'Press.article'
        db.add_column('press_press', 'article',
                      self.gf('django.db.models.fields.related.ForeignKey')(default=111, related_name='press', to=orm['document.Article']),
                      keep_default=False)

        # Deleting field 'Press.description'
        db.delete_column('press_press', 'description')

        # Deleting field 'Press.gen_description'
        db.delete_column('press_press', 'gen_description')

        # Deleting field 'Press.keywords'
        db.delete_column('press_press', 'keywords')

        # Deleting field 'Press.user'
        db.delete_column('press_press', 'user_id')

        # Deleting field 'Press.sub_title'
        db.delete_column('press_press', 'sub_title')

        # Deleting field 'Press.author'
        db.delete_column('press_press', 'author')

        # Deleting field 'Press._from'
        db.delete_column('press_press', '_from')

        # Deleting field 'Press.content'
        db.delete_column('press_press', 'content')


        # Changing field 'Press.title'
        db.alter_column('press_press', 'title', self.gf('django.db.models.fields.CharField')(max_length=100, null=True))

    models = {
        'press.press': {
            'Meta': {'ordering': "('publish_date',)", 'object_name': 'Press'},
            '_from': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            '_is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'author': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'category': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'press'", 'to': "orm['press.PressCategory']"}),
            'content': ('vsite.core.fields.RichTextField', [], {'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'gen_description': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'keywords': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'publish_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'sub_title': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
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
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'roles': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['users.Role']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        }
    }

    complete_apps = ['press']