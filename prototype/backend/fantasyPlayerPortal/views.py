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
import json

import ReceiverShare
from ReceiverShare import df_sorted_rec_share
import ConsistencyGrade
from ConsistencyGrade import df_official_player_stats

# Create your views here.

## load in the R function that parses players here
r = robjects.r
r['source']('ParseNFLPlayers.R')

## R function to get the data from a player based on name
parse_nfl_player_r = robjects.globalenv['get_player_data']

## R function to get the data based on position
parse_position_players_r = robjects.globalenv['get_position_players']

@api_view(['GET', 'POST', 'DELETE'])
def nfl_player(request, name):
    player_strvec = parse_nfl_player_r(name)
    result = player_strvec[0]
    parsed = json.loads(result)

    if parsed == []:
        parsed = {'message': 'Our platform currently only supports offensive players and kickers. Try another search term.'}

    if request.method == 'GET':
        return JsonResponse(parsed, status=status.HTTP_200_OK, safe=False, json_dumps_params={"indent": 4})
    else:
        return JsonResponse({'message': 'This operation is not supported'}, status=status.HTTP_204_NO_CONTENT)

def position_players(request, pos):
    position_strvec = parse_position_players_r(pos)
    position_result = position_strvec[0]
    parsed_position = json.loads(position_result)

    if parsed_position == []:
        parsed_position = {'message': 'Our platform currently only supports offensive players and kickers. Try another search term.'}

    if request.method == 'GET':
        return JsonResponse(parsed_position, status=status.HTTP_200_OK, safe=False, json_dumps_params={"indent": 4})
    else:
        return JsonResponse({'message': 'This operation is not supported'}, status=status.HTTP_204_NO_CONTENT)

def advanced_metrics(request):
    df = df_sorted_rec_share
    df2 = df_official_player_stats
    df2 = df2[['player_id', 'consistency_grade']]

    df = df[['player_id', 'rec_dom', 'rec_share', 'rec_share_%']]

    dff = df.set_index('player_id').join(df2.set_index('player_id'), on='player_id', lsuffix='', rsuffix='')

    metrics = dff.to_json(orient='index')
    metrics = json.loads(metrics)

    if request.method == 'GET':
            return JsonResponse(metrics, status=status.HTTP_200_OK, safe=False, json_dumps_params={"indent": 4})
    else:
        return JsonResponse({'message': 'This operation is not supported'}, status=status.HTTP_204_NO_CONTENT)

