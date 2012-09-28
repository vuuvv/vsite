import os
from vsite.product.models import Category, Product
from django.conf import settings

settings.DEBUG = False

basedir = os.path.dirname(__file__)
file = os.path.join(basedir, 'product.csv')

with open(file, "r") as file:
	i = 0;
	for line in file.readlines():
		c, sku, name, url = line.split(",")
		print i, name
		category = Category.objects.get(cached_url=url.strip())
		product = Product()
		product.sku = sku
		product.name = name.decode("gbk")
		product.image = "upload/product/%s.jpg" % sku
		product.thumbnail = "upload/product/thumb/%s.jpg" % sku
		product.save()
		product.categories.add(category)
		i += 1





