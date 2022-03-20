library(nflverse)
library(tidymodels)
library(tidyverse)

options(warn=-1)

player_stats <- load_player_stats(seasons = most_recent_season())
player_stats_kicker <- load_player_stats(seasons = most_recent_season(), stat_type = "kicking")
roster <- load_rosters(seasons = most_recent_season())
team_data <- load_teams()

get_player_data <- function(player_name_query) {
  filtered_player_roster <- roster %>% filter(full_name == player_name_query) %>% select(-season)
  if(filtered_player_roster$position == 'K') {
    player_stats_raw <- player_stats_kicker %>% filter(grepl(filtered_player_roster$last_name, player_name)) %>% mutate_if(is.character, as.factor)
    if(dim(player_stats_raw)[1] == 0) {
      broken <- add_column(filtered_player_roster %>% select(full_name), message = "Not an active player")
      broken_json <- jsonlite::toJSON(broken, pretty=TRUE)
      return(broken_json)
    }
    player_numeric_data <- player_stats_raw %>% summarise(across(where(is.numeric), mean)) %>% mutate_if(is.numeric, round, digits = 2)
    player_factor_data <- player_stats_raw %>% slice_head(n = 1) %>% select(where(is.factor)) %>% select(!season_type)
    player_team_data <- team_data %>% filter(team_abbr == player_factor_data$team)
  } else {
    player_stats_raw <- player_stats %>% filter(grepl(filtered_player_roster$last_name, player_name)) %>% mutate_if(is.character, as.factor)
    if(dim(player_stats_raw)[1] == 0) {
      broken <- add_column(filtered_player_roster %>% select(full_name), message = "Not an active player")
      broken_json <- jsonlite::toJSON(broken, pretty=TRUE)
      return(broken_json)
    }
    player_numeric_data <- player_stats_raw %>% summarise(across(where(is.numeric), mean)) %>% mutate_if(is.numeric, round, digits = 2)
    player_factor_data <- player_stats_raw %>% slice_head(n = 1) %>% select(where(is.factor)) %>% select(!season_type)
    player_team_data <- team_data %>% filter(team_abbr == player_factor_data$recent_team)
  }
  full_player_data <- bind_cols(filtered_player_roster, player_numeric_data, player_factor_data, player_team_data)
  player_json <- jsonlite::toJSON(full_player_data, pretty=TRUE)
  return(player_json)
}

get_player_data("Tom Brady")
get_player_data("Trace McSorley")

get_position_players <- function(position_query) {
  position_roster <- roster %>% filter(position == position_query)
  ran = FALSE
  position_info <- list()
  for(player in position_roster$full_name) {
    player_data <- jsonlite::fromJSON(get_player_data(player))
    position_info[[player]] <- player_data
  }
  position_info_json <- jsonlite::toJSON(position_info, pretty=TRUE)
  return(position_info_json)
}

#    if(!ran) {
#  position_info <- list(player = player_data)
# position_info[[player]] <- player_data
# } else {
#   position_info[[player]] <- player_data
# } 
# ran = TRUE

get_position_players("QB")
