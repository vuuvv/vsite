# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Dealer.zipcode'
        db.add_column('dealer_dealer', 'zipcode',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=50, blank=True),
                      keep_default=False)

        # Adding field 'Dealer.latitude'
        db.add_column('dealer_dealer', 'latitude',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=50, blank=True),
                      keep_default=False)

        # Adding field 'Dealer.longitude'
        db.add_column('dealer_dealer', 'longitude',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=50, blank=True),
                      keep_default=False)


        # Changing field 'Dealer.area'
        db.alter_column('dealer_dealer', 'area_id', self.gf('mptt.fields.TreeForeignKey')(to=orm['dealer.Area']))

    def backwards(self, orm):
        # Deleting field 'Dealer.zipcode'
        db.delete_column('dealer_dealer', 'zipcode')

        # Deleting field 'Dealer.latitude'
        db.delete_column('dealer_dealer', 'latitude')

        # Deleting field 'Dealer.longitude'
        db.delete_column('dealer_dealer', 'longitude')


        # Changing field 'Dealer.area'
        db.alter_column('dealer_dealer', 'area_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['dealer.Area']))

    models = {
        'dealer.area': {
            'Meta': {'object_name': 'Area'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'level': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'lft': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'parent': ('mptt.fields.TreeForeignKey', [], {'blank': 'True', 'related_name': "'children'", 'null': 'True', 'to': "orm['dealer.Area']"}),
            'rght': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'tree_id': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'})
        },
        'dealer.dealer': {
            'Meta': {'ordering': "('name',)", 'object_name': 'Dealer'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'address': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'area': ('mptt.fields.TreeForeignKey', [], {'related_name': "'dealears'", 'to': "orm['dealer.Area']"}),
            'contact': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'fax': ('django.db.models.fields.CharField', [], {'max_length': '25', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'latitude': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'longitude': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'mobile': ('django.db.models.fields.CharField', [], {'max_length': '25', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'tel': ('django.db.models.fields.CharField', [], {'max_length': '25', 'blank': 'True'}),
            'website': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'zipcode': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'})
        }
    }

    complete_apps = ['dealer']