# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'PropertyKey'
        db.create_table('product_propertykey', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('product', ['PropertyKey'])

        # Adding model 'Property'
        db.create_table('product_property', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('product', self.gf('django.db.models.fields.related.ForeignKey')(related_name='properties', to=orm['product.Product'])),
            ('key', self.gf('django.db.models.fields.related.ForeignKey')(related_name='properties', to=orm['product.PropertyKey'])),
            ('value', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
        ))
        db.send_create_signal('product', ['Property'])

        # Adding model 'Technology'
        db.create_table('product_technology', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('description', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('image', self.gf('django.db.models.fields.files.ImageField')(max_length=100, blank=True)),
        ))
        db.send_create_signal('product', ['Technology'])

        # Adding field 'Product.sku'
        db.add_column('product_product', 'sku',
                      self.gf('django.db.models.fields.CharField')(default=0, max_length=50),
                      keep_default=False)

        # Adding field 'Product.summary'
        db.add_column('product_product', 'summary',
                      self.gf('vsite.core.fields.RichTextField')(default=0),
                      keep_default=False)

        # Adding field 'Product.assembly'
        db.add_column('product_product', 'assembly',
                      self.gf('vsite.core.fields.RichTextField')(default=0),
                      keep_default=False)

        # Adding field 'Product.manual'
        db.add_column('product_product', 'manual',
                      self.gf('vsite.core.fields.RichTextField')(default=0),
                      keep_default=False)

        # Adding field 'Product.technology'
        db.add_column('product_product', 'technology',
                      self.gf('django.db.models.fields.related.ForeignKey')(default=0, related_name='products', to=orm['product.Technology']),
                      keep_default=False)


        # Changing field 'Product.image'
        db.alter_column('product_product', 'image', self.gf('django.db.models.fields.files.ImageField')(max_length=100))

        # Changing field 'Product.thumbnail'
        db.alter_column('product_product', 'thumbnail', self.gf('django.db.models.fields.files.ImageField')(max_length=100))

        # Changing field 'Category.image'
        db.alter_column('product_category', 'image', self.gf('django.db.models.fields.files.ImageField')(max_length=100))

    def backwards(self, orm):
        # Deleting model 'PropertyKey'
        db.delete_table('product_propertykey')

        # Deleting model 'Property'
        db.delete_table('product_property')

        # Deleting model 'Technology'
        db.delete_table('product_technology')

        # Deleting field 'Product.sku'
        db.delete_column('product_product', 'sku')

        # Deleting field 'Product.summary'
        db.delete_column('product_product', 'summary')

        # Deleting field 'Product.assembly'
        db.delete_column('product_product', 'assembly')

        # Deleting field 'Product.manual'
        db.delete_column('product_product', 'manual')

        # Deleting field 'Product.technology'
        db.delete_column('product_product', 'technology_id')


        # Changing field 'Product.image'
        db.alter_column('product_product', 'image', self.gf('vsite.core.fields.ImageField')(max_length=256))

        # Changing field 'Product.thumbnail'
        db.alter_column('product_product', 'thumbnail', self.gf('vsite.core.fields.ImageField')(max_length=256))

        # Changing field 'Category.image'
        db.alter_column('product_category', 'image', self.gf('vsite.core.fields.ImageField')(max_length=256))

    models = {
        'product.category': {
            'Meta': {'object_name': 'Category'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'level': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'lft': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'meta_description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'meta_keywords': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'parent': ('mptt.fields.TreeForeignKey', [], {'to': "orm['product.Category']", 'null': 'True', 'blank': 'True'}),
            'rght': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'categories'", 'to': "orm['sites.Site']"}),
            'slug': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'tree_id': ('django.db.models.fields.PositiveIntegerField', [], {'db_index': 'True'})
        },
        'product.product': {
            'Meta': {'ordering': "('ordering',)", 'object_name': 'Product'},
            'active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'assembly': ('vsite.core.fields.RichTextField', [], {}),
            'categories': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'products'", 'symmetrical': 'False', 'to': "orm['product.Category']"}),
            'creation_date': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'gen_description': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'keywords': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'manual': ('vsite.core.fields.RichTextField', [], {}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'ordering': ('django.db.models.fields.IntegerField', [], {'default': '1000'}),
            'sku': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'slug': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            'summary': ('vsite.core.fields.RichTextField', [], {}),
            'tags': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'technology': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'products'", 'to': "orm['product.Technology']"}),
            'thumbnail': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'})
        },
        'product.property': {
            'Meta': {'object_name': 'Property'},
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'key': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'properties'", 'to': "orm['product.PropertyKey']"}),
            'product': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'properties'", 'to': "orm['product.Product']"}),
            'value': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'product.propertykey': {
            'Meta': {'object_name': 'PropertyKey'},
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'product.technology': {
            'Meta': {'object_name': 'Technology'},
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'blank': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'sites.site': {
            'Meta': {'ordering': "('domain',)", 'object_name': 'Site', 'db_table': "'django_site'"},
            'domain': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        }
    }

    complete_apps = ['product']