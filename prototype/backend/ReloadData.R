#' ReloadData.R
#' 
#' Update the APIData.Rdata file to get the most recent data on players.
#' This script is designed to be run about once a week to keep the data up 
#' to date so that a quicker version of the functions can be used for the API.
#' 
#' @author Marion Geary
#' April 19, 2022

defaultW <- getOption("warn")
options(warn = -1)

options(nflreadr.verbose = FALSE)
(library(nflverse))
(library(tidyverse))

ff_rankings <- load_ff_rankings()

ff_rankings <- ff_rankings %>%
  filter(str_starts(page_type, "redraft")) %>%
  filter(page_type != "redraft-op") %>%
  filter(page_type != "redraft-overall") %>%
  filter(page_type != "redraft-lb") %>%
  filter(page_type != "redraft-idp") %>%
  select(yahoo_id, ecr, page_type) %>%
  mutate(yahoo_id = as.numeric(yahoo_id))

official_player_stats <- calculate_player_stats(
    nflreadr::load_pbp(),
    weekly = TRUE
  ) %>% filter(season_type == 'REG')

official_player_stats_total <- calculate_player_stats(
    nflreadr::load_pbp(),
    weekly = FALSE
  )

player_stats_kicking <- nflreadr::load_player_stats(
    seasons = most_recent_season(),
    stat_type = 'kicking'
  )

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
  select(-c(espn_id, sportradar_id, rotowire_id, pff_id, fantasy_data_id, 
            sleeper_id, player_name, cfb_id, pos, date_modified,
            player_display_name, team_abbr, player_position, player_first_name,
            player_last_name, player_short_name, player_jersey_number,
            pfr_game_id, season_type, player, high_school,
            season, last_name, first_name))

all_data <- all_data %>%
  left_join(
    ff_rankings,
    by = c('yahoo_id' = 'yahoo_id'),
    suffix = c('', '.xyz'),
    keep = FALSE,
    na_matches = "never"
  ) %>%
  left_join(
    official_player_stats_total,
    by = c('gsis_id' = 'player_id'),
    suffix = c('', '_total'),
    keep = FALSE,
    na_matches = "never"
  ) %>% distinct()

all_data <- all_data %>%
  mutate_if(is.character, as.factor) %>%
  filter(!is.na(full_name))

all_data <- all_data %>%
  distinct() %>%
  select(- (grep(".xyz", names(all_data))))

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
  non_unique <- non_unique
  non_unique_cols <- colnames(non_unique)
  player_large_data_1 <- player_large_data %>% select(-non_unique_cols) %>% distinct()
  # stopifnot(dim(player_large_data_1)[1] == 1)
  player_large_data_n <- player_large_data %>% select(non_unique_cols)
  full_player_data <- c(player_large_data_1, player_large_data_n)
  player_json <- jsonlite::toJSON(full_player_data, pretty = TRUE)
  return(player_json)
}

#' Update the data about the players in each position
#'
#' @param position_query The abbreviation for the desired position
#' @return A JSON containing data on all players of the position
update_position_players <- function(position_query) {
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

qb_data <- update_position_players("QB")
rb_data <- update_position_players("RB")
wr_data <- update_position_players("WR")
pk_data <- update_position_players("PK")
cb_data <- update_position_players("CB")
db_data <- update_position_players("DB")
de_data <- update_position_players("DE")
dt_data <- update_position_players("DT")
k_data <- update_position_players("K")
lb_data <- update_position_players("LB")
ls_data <- update_position_players("LS")
ol_data <- update_position_players("OL")
p_data <- update_position_players("P")
t_data <- update_position_players("T")
te_data <- update_position_players("TE")
c_data <- update_position_players("C")
fb_data <- update_position_players("FB")
g_data <- update_position_players("G")
ot_data <- update_position_players("OT")
ss_data <- update_position_players("SS")
fs_data <- update_position_players("FS")
og_data <- update_position_players("OG")
nt_data <- update_position_players("NT")
olb_data <- update_position_players("OLB")
dl_data <- update_position_players("DL")
ilb_data <- update_position_players("ILB")
s_data <- update_position_players("S")

save.image('APIData.Rdata')