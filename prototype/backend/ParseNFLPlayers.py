import rpy2.robjects as robjects

r = robjects.r
r['source']('ParseNFLPlayers.R')

parse_nfl_player_r = robjects.globalenv['get_player_data']

player_json = parse_nfl_player_r("Patrick Mahomes")

print(player_json)
