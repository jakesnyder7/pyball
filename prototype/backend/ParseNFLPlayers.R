#' ParseNFLPlayers.R
#' 
#' Functions to return data on players and positions to the
#' REST API in django. All data is returned in JSON format.
#' 
#' @author Marion Geary
#' March 22, 2022

library(nflverse)
library(tidyverse)

load('APIData.Rdata')

# load in needed data frames from nflverse

official_player_stats <- calculate_player_stats(nflreadr::load_pbp(), weekly = TRUE)

player_stats_kicking <- nflreadr::load_player_stats(seasons = most_recent_season(), stat_type = 'kicking')

combine <- load_combine(seasons = TRUE)

roster <- load_rosters(seasons = most_recent_season())

team_data <- load_teams()

injuries <- load_injuries()

next_gen_pass <- load_nextgen_stats(
  seasons = most_recent_season(),
  stat_type = 'passing'
)

next_gen_rec <- load_nextgen_stats(
  seasons = most_recent_season(),
  stat_type = 'receiving'
)

next_gen_rush <- load_nextgen_stats(
  seasons = most_recent_season(),
  stat_type = 'rushing'
)

snap_counts <- load_snap_counts(seasons = most_recent_season())

# Join the data :)

roster_off <- roster %>%
  full_join(
    official_player_stats,
    by = c("gsis_id" = "player_id"),
    suffix = c('', '.xyz'),
    keep = FALSE,
    na_matches = 'never'
  ) 

roster_off <- roster_off %>%
  distinct() %>%
  select(- (grep(".xyz", names(roster_off))))

roster_team_off <- roster_off %>%
  left_join(
    team_data,
    by = c("recent_team" = "team_abbr"),
    suffix = c('', '.xyz'),
    keep = FALSE,
    na_matches = 'never'
  ) 

roster_team_off <- roster_team_off %>%
  distinct() %>%
  select(- (grep(".xyz", names(roster_team_off))))

roster_off_kick <- roster_team_off %>%
  full_join(
    player_stats_kicking,
    by = c("gsis_id" = "player_id"),
    suffix = c('', '.xyz'),
    keep = FALSE,
    na_matches = 'never'
  ) 

roster_off_kick <- roster_off_kick %>%
  distinct() %>%
  select(- (grep(".xyz", names(roster_off_kick))))

roster_off_pl_kick_com <- roster_off_kick %>%
  left_join(
    combine,
    by = c('pfr_id' = 'pfr_id'),
    suffix = c('', '.xyz'),
    keep = FALSE,
    na_matches = 'never'
  )

roster_off_pl_kick_com <- roster_off_pl_kick_com %>%
  distinct() %>%
  select(- (grep(".xyz", names(roster_off_pl_kick_com)))) 

injuries <- injuries %>%
  mutate(season = as.numeric(season), week = as.numeric(week))

roster_off_pl_kick_com_team_inj <- roster_off_pl_kick_com %>%
  left_join(
    injuries,
    by = c('gsis_id' = 'gsis_id', 'season' = 'season', 'week' = 'week'),
    suffix = c('', '.xyz'),
    keep = FALSE
  )

roster_off_pl_kick_com_team_inj <- roster_off_pl_kick_com_team_inj %>%
  distinct() %>%
  select(- (grep(".xyz", names(roster_off_pl_kick_com_team_inj)))) 

all_next_gen <- roster_off_pl_kick_com_team_inj %>%
  left_join(
    next_gen_pass,
    by = c('gsis_id' = 'player_gsis_id', 'season' = 'season', 'week' = 'week'),
    suffix = c('', '.xyz'),
    keep = FALSE
  ) %>% left_join(
    next_gen_rec,
    by = c('gsis_id' = 'player_gsis_id', 'season' = 'season', 'week' = 'week'),
    suffix = c('', '.xyz'),
    keep = FALSE
  ) %>% left_join(
    next_gen_rush,
    by = c('gsis_id' = 'player_gsis_id', 'season' = 'season', 'week' = 'week'),
    suffix = c('', '.xyz'),
    keep = FALSE
  )

all_next_gen <- all_next_gen %>%
  distinct() %>%
  select(- (grep(".xyz", names(all_next_gen))))

all_data <- all_next_gen %>% left_join(
  snap_counts,
  by = c('pfr_id' = 'pfr_player_id', 'season' = 'season', 'week' = 'week'),
  suffix = c('', '.xyz'),
  keep = FALSE
)

all_data <- all_data %>%
  distinct() %>%
  select(- (grep(".xyz", names(all_data))))

all_data <- all_data %>%
  select(-c(espn_id, sportradar_id, yahoo_id, rotowire_id, pff_id,
            fantasy_data_id, sleeper_id, player_name, cfb_id, pos, date_modified,
            player_display_name, team_abbr, player_position, player_first_name,
            player_last_name, player_short_name, player_jersey_number,
            pfr_game_id, season_type, player, high_school,
            season, last_name, first_name))

all_data <- all_data %>% mutate_if(is.character, as.factor) %>% filter(!is.na(full_name))

get_player_data("Lamar Jackson")

#' Get the data about a specified player
#'
#' @param player_name_query The name of the desired player
#' @return Data on the player formatted as a JSON
get_player_data <- function(player_name_query) {
  query <- str_to_lower(player_name_query)
  gsis <- all_data %>% filter(str_to_lower(full_name) == query) %>% select(gsis_id) %>% slice(1) %>% pluck(1)
  player_large_data <- all_data %>% filter(str_to_lower(full_name) == query) %>% filter(gsis_id == gsis)
  non_unique <- player_large_data %>%
    summarise_all(n_distinct) %>%
    select_if(. != 1)
  non_unique_cols <- colnames(non_unique)
  player_large_data_1 <- player_large_data %>% select(-non_unique_cols) %>% distinct()
  # stopifnot(dim(player_large_data_1)[1] == 1)
  player_large_data_n <- player_large_data %>% select(non_unique_cols)
  full_player_data <- c(player_large_data_1, player_large_data_n)
  player_json <- jsonlite::toJSON(full_player_data, pretty = TRUE)
  return(player_json)
}

# Examples highlighting the different cases for player data return.
# This includes sample calls as well as calls that were problematic
# in previous iterations of the functions.
# get_player_data("Patrick Mahomes")
# get_player_data("patrIck mahomes")
# get_player_data("Maxx Williams")
# get_player_data("Mike Williams")
# get_player_data("Trace McSorley")
# get_player_data("Colt McCoy")
# get_player_data("Chris Thompson")

#' Get data on all players in a specified position
#'
#' @param position_query The official abbreviation of the position
#' @return Data on all players in the specified position formatted as a JSON
get_position_players <- function(position_query) {
  if(position_query == 'QB') {
    return(qb_data)
  } else if (position_query == 'RB') {
    return(rb_data)
  } else if (position_query == 'WR') {
    return(wr_data)
  } else {
    position_roster <- roster %>%
      filter(position == position_query | depth_chart_position == position_query)
    position_info <- list()
    for (player in position_roster$full_name) {
      player_data <- jsonlite::fromJSON(get_player_data(player))
      position_info[[player]] <- player_data
    }
    position_info_json <- jsonlite::toJSON(position_info, pretty = TRUE)
    return(position_info_json)
  }
}

# qb_data <- get_position_players("QB")
# rb_data <- get_position_players("RB")
# wr_data <- get_position_players("WR")
# get_position_players("PK")

# save.image('APIData.Rdata')
