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


player_scores = {"" : []}
name = ""
for index, player_name in df_weekly_stats.iterrows():
    name = df_weekly_stats["player_name"][index]
    if(name not in player_scores.keys()):
        player_scores[name] = []
    player_scores[name].append(df_weekly_stats["fantasy_points_ppr"][index])

player_var = {"" : 0}
for x in player_scores:
    if(len(player_scores[x]) > 1): 
        player_var[x] = st.variance(player_scores[x])


st.mean(player_var.values())
##st.variance(player_var.values())
player_grade = {"" : "F"}
for x in player_var:
    var = player_var[x]
    if(var < 40):
        player_grade[x] = "A"
    elif(var < 60):
        player_grade[x] = "B"
    elif(var < 90):
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

