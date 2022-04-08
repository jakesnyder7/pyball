import rpy2.robjects as robjects
import pandas as pd
import json

# Create your views here.

## load in the R function that parses players here
r = robjects.r
r['source']('ParseNFLPlayers.R')

import os
import sys

script_dir = os.path.dirname( __file__ )
mymodule_dir = os.path.join( script_dir, '..')
sys.path.append( mymodule_dir )
from ReceiverShare import df_official_player_stats

df = df_official_player_stats
print(df.head())
