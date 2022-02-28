import rpy2.robjects as ro
import pandas as pd
import json

r = ro.r
r['source']('ParseNFLPlayers.R')

parse_nfl_player_r = ro.globalenv['get_player_data']

fake_json = parse_nfl_player_r("Patrick Mahomes")

real_json = fake_json[0]

## let's do some work to just parse the fake json. Pandas is being the worst
parsed = json.loads(json_df)
json.dumps(parsed, indent=4)

