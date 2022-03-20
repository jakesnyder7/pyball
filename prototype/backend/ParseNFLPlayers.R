# load in necessary libraries
library(nflverse)
library(tidymodels)
library(tidyverse)

# turn off warnings on console
options(warn=-1)

# load in needed data frames from nflverse
player_stats <- load_player_stats(seasons = most_recent_season())
player_stats_kicker <- load_player_stats(seasons = most_recent_season(), stat_type = "kicking")
roster <- load_rosters(seasons = most_recent_season())
team_data <- load_teams()

#' Get the data about a specified player
#' 
#' @param player_name_query The name of the desired player
#' @return Data on the player formatted as a JSON
get_player_data <- function(player_name_query) {
  player_name_query <- str_to_title(player_name_query)
  filtered_player_roster <- roster %>% filter(full_name == player_name_query) %>% select(-season)
  player_name_str <- paste(substr(filtered_player_roster$first_name, 0, 1), ".", filtered_player_roster$last_name, sep = "")
  if(filtered_player_roster$position == 'K') {
    player_stats_raw <- player_stats_kicker %>% filter(player_name == player_name_str) %>% mutate_if(is.character, as.factor) %>% filter(recent_team == filtered_player_roster$team)
    if(dim(player_stats_raw)[1] == 0) {
      broken <- add_column(filtered_player_roster %>% select(full_name), message = "Not an active player")
      broken_json <- jsonlite::toJSON(broken, pretty=TRUE)
      return(broken_json)
    }
    player_numeric_data <- player_stats_raw %>% select((where(is.numeric)), -season)
    player_factor_data <- player_stats_raw %>% slice_head(n = 1) %>% select(where(is.factor), season) %>% 
      select(!season_type)
    player_team_data <- team_data %>% filter(team_abbr == player_factor_data$team)
  } else {
    player_stats_raw <- player_stats %>% filter(player_name == player_name_str) %>% mutate_if(is.character, as.factor) %>% filter(recent_team == filtered_player_roster$team)
    if(dim(player_stats_raw)[1] == 0) {
      broken <- add_column(filtered_player_roster %>% select(full_name), message = "Not an active player")
      broken_json <- jsonlite::toJSON(broken, pretty=TRUE)
      return(broken_json)
    }
    player_numeric_data <- player_stats_raw %>% select((where(is.numeric)), -season)
    player_factor_data <- player_stats_raw %>% slice_head(n = 1) %>% select(where(is.factor), season) %>% 
      select(!season_type)
    player_team_data <- team_data %>% filter(team_abbr == player_factor_data$recent_team)
  }
  full_player_data <- c(filtered_player_roster, player_numeric_data, player_factor_data, player_team_data)
  player_json <- jsonlite::toJSON(full_player_data, pretty=TRUE)
  return(player_json)
}

# examples highlighting the two cases for player data return
get_player_data("Patrick Mahomes")
get_player_data("patrIck mahomes")
get_player_data("Maxx Williams")
get_player_data("Mike Williams")
get_player_data("Trace McSorley")

#' Get data on all players in a specified position
#' 
#' @param position_query The official abbreviation of the position
#' @return Data on all players in the specified position formatted as a JSON
get_position_players <- function(position_query) {
  position_roster <- roster %>% filter(position == position_query | depth_chart_position == position_query)
  position_info <- list()
  for(player in position_roster$full_name) {
    player_data <- jsonlite::fromJSON(get_player_data(player))
    position_info[[player]] <- player_data
  }
  position_info_json <- jsonlite::toJSON(position_info, pretty=TRUE)
  return(position_info_json)
}

get_position_players("QB")
