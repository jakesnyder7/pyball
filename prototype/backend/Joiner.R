load('APIData.RData')

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
setwd('/Users/Marion/Desktop/csci335/pyball/prototype/backend')
library(tidyverse)
library(reticulate)
reticulate::source_python('ReceiverShare2.py')


