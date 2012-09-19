from access import fetch

options = {
	"col": {
		"Topic": "title",
		"Updatatimes": "publish_date",
		"Keywords": "summary",
		"DefaultPic": "thumbnail",
		"Sort_id": "category",
		"Content": "content",
	}
}

columns = ["Topic", "Updatatimes", "Keywords", "DefaultPic", "Sort_ID", "Content"]
mycolumns = ["title", "publish_date", "summary", "thumbnail", "category_id", "content"]
data = fetch("Joyou&Data.asa", "35_News", columns)

from vsite.press.models import Press, PressCategory

def parse_time(time):
	return "%s-%s-%s %s:%s:%s" % (time.year, time.month, time.day, time.hour, time.minute, time.second)

for item in data:
	if int(item["Sort_ID"]) in [1,2]:
		print item["Topic"]
		press = Press()
		press.title = item["Topic"]
		press.publish_date = parse_time(item["Updatatimes"])
		press.summary = item["Keywords"]
		press.thumbnail = item["DefaultPic"]
		press.category = PressCategory.objects.get(pk=item["Sort_ID"])
		press.content = item["Content"]
		press.save()

