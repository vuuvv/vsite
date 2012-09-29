import os
from shutil import copy
from vsite.product.models import Product

src = "f:/product/"
tar = "f:/product/need/fix1/"

#products = Product.objects.all()

count = 0

products = []
with open("f:/product/log.txt") as nfound:
	lines = nfound.readlines()
	products = [line.strip() for line in lines]

with open("f:/product/log1.txt", "w") as log:
	for p in products:
		print count, p
		exist = False
		for ext in ["tif", "psd", "bmp", "jpg"]:
			path = os.path.join(src, p) + "." + ext
			if os.path.exists(path):
				copy(path, tar)
				exist = True
		if not exist:
			log.write("%s\n" % p)
		count += 1

