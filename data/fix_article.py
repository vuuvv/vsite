# -*- coding: utf-8 -*-

import os
import shutil
from django.conf import settings
from pyquery import PyQuery

settings.DEBUG = False

def fix_img(index, elem):
    q = PyQuery(elem)
    src = q.attr("src")
    q.attr("src", _fix_img(src))

def _fix_img(src):
    filename = os.path.basename(src)
    copy(filename)
    return "%s%s%s" % (settings.MEDIA_URL, "upload/press/", filename)

def copy(filename):
    d = "F:/Webdup/MyWebsites/joyou.com.cn/download/latest/www.joyou.com.cn/upload"
    t = "F:/code/vsite/site_demo/site_demo/static/media/upload/press"
    try:
        shutil.copy2(os.path.join(d, filename), t)
    except:
        print "not find:", filename

def fix(html):
    q = PyQuery(html)
    q('img').map(fix_img)
    h3 = q('h3')
    sub_title = h3.text()
    if not sub_title:
        sub_title = q('h2').text()
    q('h1, h2, h3').remove()

    return q.html(), sub_title

import re
def get_author(html):
    regex = re.compile("\s*/\s*营销中心\s+([^ ]*)\s+([^ \n<)]*)")
    #regex = re.compile("文\s*/\s*(\S+)）")
    author, _from = None, None
    if html:
        m = regex.search(html.encode("utf8"))
        if m:
            _from = ("中宇卫浴").decode("utf8")
            author = m.groups()[0].decode("utf8")
    return _from, author

from vsite.press.models import Press

press = Press.objects.all()

for p in press:

    if p.id >= 287:
        print p.id,
        _from, author = get_author(p.content)
        print _from, author
        if not p.press_from and _from:
            p.press_from = _from
        if not p.author and author:
            p.author = author

        #print p.id
        #content, sub_title = fix(p.content)
        #p.content = content
        #if not p.sub_title and sub_title:
        #    p.sub_title = sub_title
        #p.thumbnail = _fix_img(p.thumbnail.url)
        p.save()

