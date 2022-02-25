from django.shortcuts import render
from rest_framework import viewsets
from .serializers import FantasyPlayerPortalSerializer
from .models import NFLPlayer

# Create your views here.

class FantasyPlayerPortalView(viewsets.ModelViewSet):
    serializer_class = FantasyPlayerPortalSerializer
    queryset = NFLPlayer.objects.all()
