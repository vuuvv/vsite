import json
import requests
from vsite.dealer.models import Dealer

URL = "http://maps.googleapis.com/maps/api/geocode/json"

def get_location(address):
    params = {"sensor": "false", "address": address}
    r = requests.get(URL, params=params)
    return json.loads(r.text)["results"][0]["geometry"]["location"]

def set_dealer_location(force=False):
    dealers = Dealer.objects.all()
    for d in dealers:
        if force or (not d.latitude or not d.longitude):
            try:
                loc = get_location(d.address)
                d.latitude = loc["lat"]
                d.longitude = loc["lng"]
                d.save()
            except:
                pass

from django.conf import settings
settings.DEBUG = False

set_dealer_location(True)



