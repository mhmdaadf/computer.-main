from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Address, CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("email", "username", "full_name", "is_staff", "is_active")
    search_fields = ("email", "username", "full_name")
    ordering = ("email",)
    fieldsets = UserAdmin.fieldsets + (("Extra", {"fields": ("full_name", "phone")} ),)
    add_fieldsets = UserAdmin.add_fieldsets + (("Extra", {"fields": ("email", "full_name", "phone")} ),)


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ("user", "label", "city", "country", "is_default")
    list_filter = ("is_default", "country")
    search_fields = ("user__email", "label", "city")
