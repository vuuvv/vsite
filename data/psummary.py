import os
from vsite.product.models import Category, Product, Technology
from django.conf import settings

settings.DEBUG = False

shunyi = Technology.objects.get(pk=1)
qili = Technology.objects.get(pk=2)
jingqian = Technology.objects.get(pk=3)
jianjing = Technology.objects.get(pk=4)
yuling = Technology.objects.get(pk=5)
jingchi = Technology.objects.get(pk=6)
jingxuan = Technology.objects.get(pk=8)

tmap = {
    Category.objects.get(pk=2): Product.objects.get(pk=1).summary,
    Category.objects.get(pk=3): Product.objects.get(pk=147).summary,
    Category.objects.get(pk=4): Product.objects.get(pk=197).summary,
    Category.objects.get(pk=49): Product.objects.get(pk=634).summary,
    Category.objects.get(pk=7): Product.objects.get(pk=342).summary,
    Category.objects.get(pk=5): Product.objects.get(pk=265).summary,
    Category.objects.get(pk=6): Product.objects.get(pk=322).summary,
}

for p in Product.objects.all():
    for c in p.categories.all():
        ancestors = c.get_ancestors(include_self=True)

        for a in ancestors:
            if a in tmap:
                print p.id, p.slug
                p.summary = tmap[a]
                p.save()


