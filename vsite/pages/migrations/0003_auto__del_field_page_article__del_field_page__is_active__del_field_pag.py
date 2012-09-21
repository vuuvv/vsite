# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Page.article'
        db.delete_column('pages_page', 'article_id')

        # Deleting field 'Page._is_active'
        db.delete_column('pages_page', '_is_active')

        # Deleting field 'Page._cached_url'
        db.delete_column('pages_page', '_cached_url')

        # Adding field 'Page.active'
        db.add_column('pages_page', 'active',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Page.cached_url'
        db.add_column('pages_page', 'cached_url',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=300, db_index=True, blank=True),
                      keep_default=False)

        # Adding field 'Page.content'
        db.add_column('pages_page', 'content',
                      self.gf('vsite.core.fields.RichTextField')(default='', blank=True),
                      keep_default=False)

        # Adding field 'Page.meta_keywords'
        db.add_column('pages_page', 'meta_keywords',
                      self.gf('django.db.models.fields.TextField')(default='', blank=True),
                      keep_default=False)

        # Adding field 'Page.meta_description'
        db.add_column('pages_page', 'meta_description',
                      self.gf('django.db.models.fields.TextField')(default='', blank=True),
                      keep_default=False)


    def backwards(self, orm):
        # Adding field 'Page.article'
        db.add_column('pages_page', 'article',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='pages', null=True, to=orm['document.Article'], blank=True),
                      keep_default=False)

        # Adding field 'Page._is_active'
        db.add_column('pages_page', '_is_active',
                      self.gf('django.db.models.fields.BooleanField')(default=True),
                      keep_default=False)

        # Adding field 'Page._cached_url'
        db.add_column('pages_page', '_cached_url',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=300, blank=True, db_index=True),
                      keep_default=False)

        # Deleting field 'Page.active'
        db.delete_column('pages_page', 'active')

        # Deleting field 'Page.cached_url'
        db.delete_column('pages_page', 'cached_url')

        # Deleting field 'Page.content'
        db.delete_column('pages_page', 'content')

        # Deleting field 'Page.meta_keywords'
        db.delete_column('pages_page', 'meta_keywords')

        # Deleting field 'Page.meta_description'
        db.delete_column('pages_page', 'meta_description')


    models = {
        'pages.page': {
            'Meta': {'ordering': "('tree_id', 'lft')", 'object_name': 'Page'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'cached_url': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '300', 'db_index': 'True', 'blank': 'True'}),
            'content': ('vsite.core.fields.RichTextField', [], {'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'in_navigation': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'level': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'lft': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'meta_description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'meta_keywords': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'parent': ('mptt.fields.TreeForeignKey', [], {'blank': 'True', 'related_name': "'children'", 'null': 'True', 'to': "orm['pages.Page']"}),
            'publish_date': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'rght': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'pages'", 'to': "orm['sites.Site']"}),
            'slug': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'tree_id': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'})
        },
        'sites.site': {
            'Meta': {'ordering': "('domain',)", 'object_name': 'Site', 'db_table': "'django_site'"},
            'domain': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        }
    }

    complete_apps = ['pages']