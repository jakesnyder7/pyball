library(nflverse)
library(tidymodels)
library(tidyverse)

player_stats <- load_player_stats(seasons = most_recent_season())
player_stats_kicker <- load_player_stats(seasons = most_recent_season(), stat_type = "kicking")
roster <- load_rosters(seasons = most_recent_season())
team_data <- load_teams()

get_player_data <- function(player_name_query) {
  filtered_player_roster <- roster %>% filter(full_name == player_name_query)
  if(filtered_player_roster$position == 'K') {
    player_stats_raw <- player_stats_kicker %>% filter(grepl(filtered_player_roster$last_name, player_name)) %>% mutate_if(is.character, as.factor)
    player_numeric_data <- player_stats_raw %>% summarise(across(where(is.numeric), mean)) %>% mutate_if(is.numeric, round, digits = 2)
    player_factor_data <- player_stats_raw %>% slice_head(n = 1) %>% select(where(is.factor)) %>% select(!season_type)
    player_team_data <- team_data %>% filter(team_abbr == player_factor_data$team)
  } else {
    player_stats_raw <- player_stats %>% filter(grepl(filtered_player_roster$last_name, player_name)) %>% mutate_if(is.character, as.factor)
    player_numeric_data <- player_stats_raw %>% summarise(across(where(is.numeric), mean)) %>% mutate_if(is.numeric, round, digits = 2)
    player_factor_data <- player_stats_raw %>% slice_head(n = 1) %>% select(where(is.factor)) %>% select(!season_type)
    player_team_data <- team_data %>% filter(team_abbr == player_factor_data$recent_team)
  }
  full_player_data <- bind_cols(filtered_player_roster, player_numeric_data, player_factor_data, player_team_data)
  player_json <- jsonlite::toJSON(full_player_data)
  return(player_json)
}

get_player_data("Harrison Butker")


