import os


class ws(object):
    debug = os.environ.get('SERVER_SOFTWARE', '').startswith('Development/')

    def json_serializer(obj):

        """Default JSON serializer."""
        import calendar, datetime

        if isinstance(obj, datetime.datetime):
            if obj.utcoffset() is not None:
                obj = obj - obj.utcoffset()
        millis = int(
            calendar.timegm(obj.timetuple()) * 1000 +
            obj.microsecond / 1000
        )
        return millis

