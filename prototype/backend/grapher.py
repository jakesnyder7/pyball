import rpy2.robjects as ro
import pandas as pd
import json
from rpy2.robjects import pandas2ri
from rpy2.robjects.conversion import localconverter
import matplotlib.pyplot as plt
import numpy as np


r = ro.r
r["source"]("ParseNFLPlayers.R")

parse_nfl_player_r = ro.globalenv["get_player_data"]


def get_player_df(name):
    """Fetches the data and converts it to a dataframe.

    Args:
        name (str): Player's name.
    
    Returns:
        df (pd.DataFrame): Player's data. 

    """

    return pd.json_normalize(
        json.loads(parse_nfl_player_r(name)[0])
    )


def make_graph(name_1, name_2, stats):
    """Creates a graph based on two players and statistics.
    
    Args:
        name_1 (str): Name of the first player.
        name_2 (str): Name of the second player.
        stats (list[str]): Statistics to use.

    Returns:

    """

    df_1 = get_player_df(name_1)[["full_name", *stats]]
    df_2 = get_player_df(name_2)[["full_name", *stats]]


def main():
    player_df: pd.DataFrame = get_player_df("Patrick Mahomes")

    stats = ["touchdowns"]
    player_df = player_df[["full_name", *stats]]

    print(player_df)


if __name__ == "__main__":
    main()
