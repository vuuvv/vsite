# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Honor.thumbnail'
        db.delete_column('honor_honor', 'thumbnail')


    def backwards(self, orm):
        # Adding field 'Honor.thumbnail'
        db.add_column('honor_honor', 'thumbnail',
                      self.gf('django.db.models.fields.files.ImageField')(default=11, max_length=100, blank=True),
                      keep_default=False)


    models = {
        'honor.category': {
            'Meta': {'ordering': "('ordering', '-name')", 'object_name': 'Category'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'ordering': ('django.db.models.fields.IntegerField', [], {'default': '1000'}),
            'slug': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'})
        },
        'honor.honor': {
            'Meta': {'ordering': "('-category__slug',)", 'object_name': 'Honor'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'category': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'honors'", 'to': "orm['honor.Category']"}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'ordering': ('django.db.models.fields.IntegerField', [], {'default': '1000'})
        }
    }

    complete_apps = ['honor']