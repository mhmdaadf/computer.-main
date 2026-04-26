import copy
import sys

from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.core"

    def ready(self):
        # Python 3.14 changed copy semantics around super(), which breaks
        # Django 5.1's BaseContext.__copy__. Patch only on affected versions.
        if sys.version_info < (3, 14):
            return

        from django.template.context import BaseContext

        if getattr(BaseContext.__copy__, "__name__", "") == "_py314_compatible_copy":
            return

        def _py314_compatible_copy(self):
            duplicate = object.__new__(type(self))
            if hasattr(self, "__dict__"):
                duplicate.__dict__.update(self.__dict__)
            duplicate.dicts = self.dicts[:]
            return duplicate

        BaseContext.__copy__ = _py314_compatible_copy
