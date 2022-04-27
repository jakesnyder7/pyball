#!/usr/bin/env python
# coding: utf-8

# In[32]:

import warnings
warnings.filterwarnings("ignore")


import rpy2.robjects as ro
import pandas as pd
import json
import statistics as st

r = ro.r
r['source']('ParseNFLPlayers.R')

parse_nfl_player_r = ro.globalenv['get_player_data']
parse_position_players_r = ro.globalenv['get_position_players']


# In[33]:


from rpy2.robjects import pandas2ri
from rpy2.robjects.conversion import localconverter

# This is an R "tibble" of the data
# We load this object from the R script we used earlier
player_stats_r = ro.globalenv['player_stats']
team_data_r = ro.globalenv['team_data']
player_stats_kicker_r = ro.globalenv['player_stats_kicker']
roster_r = ro.globalenv['roster']
official_player_stats_r = ro.globalenv['official_player_stats_total']
weekly_stats = ro.globalenv['official_player_stats']

# Convert the tibble to a pandas data frame
with localconverter(ro.default_converter + pandas2ri.converter):
    df_player_stats = ro.conversion.rpy2py(player_stats_r)
    df_team_data = ro.conversion.rpy2py(player_stats_r)
    df_player_stats_kicker = ro.conversion.rpy2py(player_stats_kicker_r)
    df_roster = ro.conversion.rpy2py(roster_r)
    df_official_player_stats = ro.conversion.rpy2py(official_player_stats_r)
    df_weekly_stats = ro.conversion.rpy2py(weekly_stats)


test = df_weekly_stats.iloc[0:17,47]
st.variance(test)

## array of weekly scores
player_scores = {"" : []}
name = ""
for index, player_name in df_weekly_stats.iterrows():
    name = df_weekly_stats["player_name"][index]
    if(name not in player_scores.keys()):
        player_scores[name] = []
    player_scores[name].append(df_weekly_stats["fantasy_points_ppr"][index])

## name to id connection
player_name_id = {"" : ""}
for index, player_name in df_official_player_stats.iterrows():
    name = df_official_player_stats["player_name"][index]
    id = df_official_player_stats["player_id"][index]
    player_name_id[name] = id

## id to pos connection
idpos = {"":""}
for index, gsis_id in df_roster.iterrows():
    id2 = df_roster["gsis_id"][index]
    pos1 = df_roster["position"][index]
    idpos[id2] = pos1

## adding position
df_official_player_stats["pos"] = "NA"
for index, player_name in df_official_player_stats.iterrows():
    name = df_official_player_stats["player_name"][index]
    id1 = player_name_id[name]
    if(idpos.__contains__(id1)):
        position = idpos[id1]
        df_official_player_stats["pos"][index] = position

## Calculating good games
player_gg = {"" : 0}
for x in player_scores:
    if(len(player_scores[x]) > 1):
        score = 0
        if(player_name_id.__contains__(x) and idpos.__contains__(player_name_id[x])):
            pos2 = idpos[player_name_id[x]]
        if(pos2 == "QB"):
            for y in player_scores[x]:
                if(y > 19.2):
                    score += 1
        if(pos2 == "RB"):
            for y in player_scores[x]:
                if(y > 14.8):
                    score += 1
        if(pos2 == "WR"):
            for y in player_scores[x]:
                if(y > 14.2):
                    score += 1
        if(pos2 == "TE"):
            for y in player_scores[x]:
                if(y > 10.4):
                    score += 1
        player_gg[x] = score



player_var = {"" : 0}
for x in player_scores:
    if(len(player_scores[x]) > 1): 
        player_var[x] = st.variance(player_scores[x])

player_grade = {"" : "F"}
for x in player_gg:
    score1 = player_gg[x]
    if(score1 >= 14):
        player_grade[x] = "A+"
    elif(score1 >= 12):
        player_grade[x] = "A"
    elif(score1 >= 10):
        player_grade[x] = "A-"
    elif(score1 >= 9):
        player_grade[x] = "B+"
    elif(score1 >= 7):
        player_grade[x] = "B"
    elif(score1 == 6):
        player_grade[x] = "B-"
    elif(score1 == 5):
        player_grade[x] = "C+"
    elif(score1 < 4 and score1 > 2):
        player_grade[x] = "C"
    else:
        player_grade[x] = "D"


df_official_player_stats["consistency_grade"] = "F"

for index, player_name in df_official_player_stats.iterrows():
    pname = df_official_player_stats["player_name"][index]
    ##print(len(player_scores[pname]))
    if(player_scores.__contains__(pname)):
      if (len(player_scores[pname]) > 1):
        df_official_player_stats["consistency_grade"][index] = player_grade[pname]

