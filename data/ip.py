#!/usr/bin/env python
# -*- coding: utf-8 -*-

from bisect import bisect

_LIST1, _LIST2 = [], []
_INIT = False

ip2int = lambda ip_str: reduce(lambda a, b: (a << 8) + b, [int(i) for i in ip_str.split('.')])

def _init():
    global _LIST, _INIT
    if not _INIT:
        for l in open('qqwry.dat', 'rb'):
            ip1, ip2 = l.split()[:2]
            addr = ' '.join(l.split()[2:])
            ip1, ip2 = ip2int(ip1), ip2int(ip2)
            _LIST1.append(ip1)
            _LIST2.append((ip1, ip2, addr))
        _INIT = True
    
def ip_from(ip):
    _init()
    i = ip2int(ip)
    idx = bisect(_LIST1, i)
    assert(idx > 0)
    if len(_LIST1) <= idx:
        return u'unknown ip address %s' % ip
    else:
        frm, to ,addr = _LIST2[idx - 1]
        if frm <= i <= to:
            return addr
        else:
            return u'unknown ip address %s' % ip
    
if __name__ == '__main__':
    print ip_from('115.238.54.106')
    print ip_from('220.181.29.160')
    print ip_from('115.238.54.107')
    print ip_from('8.8.8.8')

