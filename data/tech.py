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
    Category.objects.get(pk=2): [shunyi, qili, jingqian],
    Category.objects.get(pk=3): [yuling],
    Category.objects.get(pk=4): [jingchi, jingxuan],
    Category.objects.get(pk=49): [jianjing],
    Category.objects.get(pk=7): [qili],
}

for p in Product.objects.all():
    for c in p.categories.all():
        ancestors = c.get_ancestors(include_self=True)

        for a in ancestors:
            if a in tmap:
                print p.id, p.slug
                for t in tmap[a]:
                    p.technologies.add(t)
                if not p.summary:
                    p.summary = t.name
                p.save()


