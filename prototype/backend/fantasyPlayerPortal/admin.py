from django.contrib import admin
from .models import NFLPlayer
# Register your models here.

class FantasyPlayerPortalAdmin(admin.ModelAdmin):
    list_display = ('name', 'position', 'number')

admin.site.register(NFLPlayer, FantasyPlayerPortalAdmin)
