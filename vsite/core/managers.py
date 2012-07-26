class ActiveAwareContentManagerMixin(object):

	active_filters = {}

	@classmethod
	def apply_active_filters(cls, qs):
		for filter in cls.active_filters.values():
			if (callable(filter)):
				qs = filter(qs)
			else:
				qs = qs.filter(filter)
		return qs

	@classmethod
	def add_to_active_filters(cls, filter, key=None):
		if key is None:
			key = filter
		cls.active_filters[key] = filter

	def active(self):
		return self.apply_active_filters(self)

