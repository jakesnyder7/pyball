from django.shortcuts import render
from rest_framework import viewsets
from .serializers import FantasyPlayerPortalSerializer
from .models import NFLPlayer

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework.decorators import api_view

import rpy2.robjects as robjects


# Create your views here.

r = robjects.r
r['source']('ParseNFLPlayers.R')

parse_nfl_player_r = robjects.globalenv['get_player_data']

@api_view(['GET', 'POST', 'DELETE'])
def nfl_player(request, name):
    player = parse_nfl_player_r(name)

    if request.method == 'GET':
        return JsonResponse(player, status=status.HTTP_200_OK, safe=False)
    else:
        return JsonResponse({'message': 'This operation is not supported'}, status=status.HTTP_204_NO_CONTENT)



