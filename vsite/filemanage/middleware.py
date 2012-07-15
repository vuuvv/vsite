
class SWFUploaderMiddleware(object):

	def process_request(self, request):
		for key, value in request.POST.items():
			if key.startswith("__c__"):
				request.COOKIES[key[5:]] = value
