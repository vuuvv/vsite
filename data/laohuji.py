from requests import post
from random import random
from time import sleep

sleep_base = 20

headers = {
    "Referer": "http://www.ctfeshop.com.cn/s/f150984",
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:15.0) Gecko/20100101 Firefox/15.0.1",
}

url = "http://www.ctfeshop.com.cn/ajax.ashx?action=XLRD_PlaySlotMachine&t=%s"

log_file = "f:\laohuji.txt"

def get_sleep_seconds():
    return sleep_base + 20 * random()

def make_request():
    u = url % random()
    return post(u, headers=headers, data={"a":"b"})

def loop():
    while True:
        try:
            with open(log_file, "a") as log:
                r = make_request()
                print r.text
                log.write(r.text.encode("utf8"))
                log.write("\n")
        except Exception:
            print "error"
        sleep(get_sleep_seconds())

if __name__ == "__main__":
    loop()



