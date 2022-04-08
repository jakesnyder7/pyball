#!/usr/bin/env python
# coding: utf-8

# In[23]:


import rpy2.robjects as ro
import pandas as pd
import json

r = ro.r
r['source']('ParseNFLPlayers.R')

parse_nfl_player_r = ro.globalenv['get_player_data']
parse_position_players_r = ro.globalenv['get_position_players']


# In[24]:


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




team_passing_tds = {}
for index, recent_team in df_official_player_stats.iterrows():
    if(df_official_player_stats["recent_team"][index] not in team_passing_tds.keys()):
        team_passing_tds[df_official_player_stats["recent_team"][index]] = 0
    team_passing_tds[df_official_player_stats["recent_team"][index]] += df_official_player_stats["passing_tds"][index]
print(team_passing_tds)

team_passing_yards = {}
for index, recent_team in df_official_player_stats.iterrows():
    if(df_official_player_stats["recent_team"][index] not in team_passing_yards.keys()):
        team_passing_yards[df_official_player_stats["recent_team"][index]] = 0
    team_passing_yards[df_official_player_stats["recent_team"][index]] += df_official_player_stats["passing_yards"][index]
print(team_passing_yards)


# In[25]:


df_official_player_stats["percent_rec_tds"] = 0
for index, receving_tds in df_official_player_stats.iterrows():
    team = str(df_official_player_stats["recent_team"][index])
    df_official_player_stats["percent_rec_tds"][index] = df_official_player_stats["receiving_tds"][index] / team_passing_tds[team]

df_official_player_stats["percent_rec_yards"] = 0
for index, receving_yards in df_official_player_stats.iterrows():
    team = str(df_official_player_stats["recent_team"][index])
    df_official_player_stats["percent_rec_yards"][index] = df_official_player_stats["receiving_yards"][index] / team_passing_yards[team]

df_official_player_stats.sort_values(by='receiving_yards', ascending=False)


# In[26]:


df_official_player_stats["rec_dom"] = 0
for index, receving_yards in df_official_player_stats.iterrows():
    df_official_player_stats["rec_dom"][index] = (1/3)*(df_official_player_stats["percent_rec_yards"][index] + df_official_player_stats["percent_rec_tds"][index] + df_official_player_stats["target_share"][index])

df_official_player_stats["rec_share"] = 0
df_official_player_stats["rec_share_%"] = 0
for index, receving_yards in df_official_player_stats.iterrows():
    df_official_player_stats["rec_share"][index] = (1/4)*(df_official_player_stats["percent_rec_yards"][index]) + (1/2)*(df_official_player_stats["percent_rec_tds"][index]) + (1/4)*(df_official_player_stats["target_share"][index])
    df_official_player_stats["rec_share_%"][index] = "{:.0%}".format(df_official_player_stats["rec_share"][index])


df_official_player_stats.sort_values(by='rec_share', ascending=False)


# In[30]:


df_sorted_rec_share = df_official_player_stats.sort_values(by='rec_share', ascending=False)

df_sorted_rec_share.head(50)
