from rest_framework import serializers
from .models import NFLPlayer

class FantasyPlayerPortalSerializer(serializers.ModelSerializer):
    class Meta:
        model = NFLPlayer
        fields = ('id', 'name', 'position', 'number')
