import rpy2.robjects as ro
import pandas as pd
import json

r = ro.r
r['source']('ParseNFLPlayers.R')

parse_nfl_player_r = ro.globalenv['get_player_data']

rdf = parse_nfl_player_r("Patrick Mahomes")

df1 = pd.DataFrame()
print(df1.to_json())
df = ro.conversion.rpy2py(rdf)

print(df)
print(rdf)

print(df.to_json())
json_df = df.to_json()

parsed = json.loads(json_df)
json.dumps(parsed, indent=4)

