from django.shortcuts import render
from rest_framework import viewsets
from .serializers import FantasyPlayerPortalSerializer
from .models import NFLPlayer

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework.decorators import api_view

import rpy2.robjects as robjects
import pandas as pd


# Create your views here.

r = robjects.r
r['source']('ParseNFLPlayers.R')

parse_nfl_player_r = robjects.globalenv['get_player_data']

@api_view(['GET', 'POST', 'DELETE'])
def nfl_player(request, name):
    player = parse_nfl_player_r(name)
    player_df = r.data(player)
    result = player_df.to_json(orient="records")
    parsed = json.loads(result)

    if request.method == 'GET':
        return JsonResponse(parsed, status=status.HTTP_200_OK, safe=False)
    else:
        return JsonResponse({'message': 'This operation is not supported'}, status=status.HTTP_204_NO_CONTENT)



