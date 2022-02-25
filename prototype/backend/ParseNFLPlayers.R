library(nflverse)
library(tidymodels)
library(tidyverse)

pbp <- load_pbp()
player_stats <- load_player_stats()
roster <- load_rosters()

get_player_data <- function(player_name_query) {
  filtered_player_roster <- roster %>% filter(full_name == player_name_query)
  player_stats_raw <- player_stats %>% filter(grepl(filtered_player_roster$last_name, player_name)) %>% mutate_if(is.character, as.factor)
  player_numeric_data <- player_stats_raw %>% 
    summarise(across(where(is.numeric), mean))
  player_factor_data <- player_stats_raw %>% slice_head(n = 1) %>% select(where(is.factor)) %>% select(!season_type)
  full_player_data <- bind_cols(filtered_player_roster, player_numeric_data, player_factor_data)
  player_json <- jsonlite::toJSON(full_player_data)
  return(player_json)
}

## here is the function call... just need to figure out how to make it work with the desired query
get_player_data("Saquon Barkley")

