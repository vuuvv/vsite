# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Job'
        db.create_table('jobs_job', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('experience', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('education', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('professional', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('age', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('gender', self.gf('django.db.models.fields.CharField')(max_length=10, blank=True)),
            ('description', self.gf('vsite.core.fields.RichTextField')(blank=True)),
            ('publish_date', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('expired_date', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
        ))
        db.send_create_signal('jobs', ['Job'])


    def backwards(self, orm):
        # Deleting model 'Job'
        db.delete_table('jobs_job')


    models = {
        'jobs.job': {
            'Meta': {'object_name': 'Job'},
            'age': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'description': ('vsite.core.fields.RichTextField', [], {'blank': 'True'}),
            'education': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'experience': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'expired_date': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'gender': ('django.db.models.fields.CharField', [], {'max_length': '10', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'professional': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'publish_date': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['jobs']